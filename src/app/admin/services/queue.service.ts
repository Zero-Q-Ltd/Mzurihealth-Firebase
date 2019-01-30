import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {AdminService} from './admin.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {emptypatient, Patient} from '../../models/Patient';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {PatientService} from './patient.service';
import {switchMap} from 'rxjs/operators';
import {emptypatientvisit, PatientVisit} from '../../models/PatientVisit';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../models/MergedPatient_Queue.model';
import {emptyfile, HospFile} from '../../models/HospFile';
import {emptyprocedureperformed, Procedureperformed} from '../../models/Procedureperformed';
import {ProceduresService} from './procedures.service';
import {MergedProcedureModel} from '../../models/MergedProcedure.model';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    activehospitalid: string;
    mainpatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    mypatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    currentpatient: BehaviorSubject<MergedPatient_QueueModel> = new BehaviorSubject({...emptymergedQueueModel});
    hospitaladmins: Array<HospitalAdmin> = [];
    adminid: string;
    currentvisitprocedures: BehaviorSubject<Array<Procedureperformed>> = new BehaviorSubject<Array<Procedureperformed>>([]);
    visithistory: BehaviorSubject<Array<PatientVisit>> = new BehaviorSubject<Array<PatientVisit>>([]);

    constructor(private db: AngularFirestore,
                private hospitalservice: HospitalService,
                private adminservice: AdminService,
                private patientservice: PatientService,
                private procedureservice: ProceduresService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospitalid = hospital.id;
                this.getwholequeue();
            }
        });
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.data.uid) {
                this.adminid = admin.id;
                // const patientid = this.userdata.config.occupied;
                // if (admin.config.occupied) {
                //     // const val = this.mypatientqueue.value.find(value => {
                //     //     return value.patientdata.id === admin.config.occupied;
                //     // });
                //     // this.currentpatient.next(val ? val : {...emptymergedQueueModel});
                // } else {
                //     this.currentpatient.next({...emptymergedQueueModel});
                // }
                this.filterqueue();
            }
        });
    }

    /**
     *fetches patientvisit and merges it with hospital file info and patient info
     */
    private getwholequeue(): void {
        this.db.collection('hospitalvisits', ref => ref
            .where('hospitalid', '==', this.activehospitalid)
            .where('checkin.status', '<', 4))
            .snapshotChanges().pipe(
            switchMap(f => {
                return combineLatest(...f.map(t => {
                    const visit = t.payload.doc.data() as PatientVisit;
                    visit.id = t.payload.doc.id;
                    return this.db.collection('patients').doc(visit.patientid).snapshotChanges().pipe(
                        switchMap(patientdata => {
                            const patient: Patient = Object.assign({}, {...emptypatient}, patientdata.payload.data());
                            patient.id = patientdata.payload.id;
                            // return {patientdata: Object.assign({}, emptypatient, patient), queuedata: visit};
                            return this.db.collection('hospitals').doc(this.activehospitalid)
                                .collection('filenumbers')
                                .doc(patient.id)
                                .snapshotChanges().pipe().map(filedata => {
                                    const file: HospFile = Object.assign({}, emptyfile, filedata.payload.data());
                                    file.id = patient.id;
                                    patient.fileinfo = file;
                                    return {patientdata: Object.assign({}, emptypatient, patient), queuedata: visit};
                                });
                        })
                    );
                }));
            })
        ).subscribe(mergedData => {
            this.mainpatientqueue.next(mergedData);
        });
    }

    /**
     * filters the queue to find the doc's queue as well as his current patient
     */
    filterqueue(): void {
        this.mainpatientqueue.subscribe(queuedata => {
            this.mypatientqueue.next(queuedata.filter(queue => {
                const equality = queue.queuedata.checkin.admin === this.adminid;
                if (queue.queuedata.checkin.status === 2) {
                    this.currentpatient.next(queue);
                    this.fetchlatestprocedures();
                    this.fetchvisithistory();
                }
                return equality;
            }));
        });
    }

    /**
     * Fetches list of procedures belonging to the most recent history of the patient which have not been paid for
     */
    fetchlatestprocedures(): void {
        this.db.firestore.collection('visitprocedures')
            .where('hospitalid', '==', this.activehospitalid)
            .where('patientid', '==', this.currentpatient.value.patientdata.id)
            .where('visitid', '==', this.currentpatient.value.queuedata.id)
            .onSnapshot(snapshot => {
                this.currentvisitprocedures.next(snapshot.docs.map(value => {
                    const p: Procedureperformed = Object.assign({}, {...emptyprocedureperformed}, value.data());
                    p.id = value.id;
                    return p;
                }));
            });
    }

    fetchvisithistory(): void {
        this.db.firestore.collection('hospitalvisits')
            .where('hospitalid', '==', this.activehospitalid)
            .where('patientid', '==', this.currentpatient.value.patientdata.id)
            .limit(10)
            .onSnapshot(snapshot => {
                this.visithistory.next(snapshot.docs.map(value => {
                    const visit = Object.assign({}, {...emptypatientvisit}, value.data());
                    visit.id = value.id;
                    return visit;
                }));
            });
    }

    /**
     * From reception to rest of admins or admins to admins
     * @param visit
     * @param adminid
     */
    assignadmin(visit: PatientVisit, adminid: string): Promise<void> {
        const batch = this.db.firestore.batch();
        visit.checkin = {
            status: 1,
            admin: adminid
        };
        batch.update(this.db.firestore.collection('hospitalvisits').doc(visit.id), visit);
        return batch.commit();
    }

    
    acceptpatient(visit: PatientVisit): Promise<void>  {
        const batch = this.db.firestore.batch();
        visit.checkin = {
            status: 2,
            admin: this.adminid
        };
        batch.update(this.db.firestore.collection('hospitalvisits').doc(visit.id), visit);
        return batch.commit();
    }

    /**
     * TODO : Finish on pricing
     * @param procedure
     * @param per
     */
    addprocedure(procedure: MergedProcedureModel, per: Procedureperformed): void {
        per.price = this.getinsuanceprice(procedure);
        this.db.collection('visitprocedures').add(procedure);
    }

    getinsuanceprice(procedure: MergedProcedureModel,): number {
        if (this.currentpatient.value.queuedata.paymentmethod.type) {
            if (procedure.customprocedure.insuranceprices[this.currentpatient.value.queuedata.paymentmethod.type]) {

            }
        }

        return 0;
    }
}
