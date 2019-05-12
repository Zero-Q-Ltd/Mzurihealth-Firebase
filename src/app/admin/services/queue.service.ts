import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {AdminService} from './admin.service';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {emptypatient, Patient} from '../../models/Patient';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {PatientService} from './patient.service';
import {switchMap} from 'rxjs/operators';
import {emptypatientvisit, PatientVisit} from '../../models/PatientVisit';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../models/MergedPatient_Queue.model';
import {ProceduresService} from './procedures.service';
import {MergedProcedureModel} from '../../models/MergedProcedure.model';
import {emptyfile, HospFile} from '../../models/HospFile';
import {firestore} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    activehospitalid: string;
    mainpatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    mypatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    currentpatient: BehaviorSubject<MergedPatient_QueueModel> = new BehaviorSubject({...emptymergedQueueModel});
    adminid: string;

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
                this.filterqueue();
            }
        });

    }

    /**
     * filters the queue to find the doc's queue as well as his current patient
     */
    filterqueue(): void {
        this.mainpatientqueue.subscribe(queuedata => {
            /**
             * reset the current patient every time patients data changes, because we are only filtering this data
             */
            let currentpatientfound = false;
            this.mypatientqueue.next(queuedata.filter(queue => {
                const equality = queue.queuedata.checkin.admin === this.adminid;
                if (equality && queue.queuedata.checkin.status === 2) {
                    console.log(queue);
                    this.currentpatient.next(queue);
                    currentpatientfound = true;
                }
                /***
                 * Only reset it when no value has been found, otherwise we know that the value has just changed and is already overwritten
                 */
                if (!currentpatientfound) {
                    this.currentpatient.next({...emptymergedQueueModel});
                }
                return equality;
            }));
        });
    }

    /**
     * From reception to rest of admins or admins to admins
     * @param visit
     * @param adminid
     */
    assignadmin(visit: PatientVisit, adminid: string): Promise<void> {
        visit.checkin = {
            status: 1,
            admin: adminid
        };
        visit.metadata.lastedit = firestore.Timestamp.now();
        console.log(visit);
        return this.db.firestore.collection('hospitalvisits').doc(visit.id).update(visit);
    }

    acceptpatient(visit: PatientVisit): Promise<void> {
        const batch = this.db.firestore.batch();
        visit.checkin = {
            status: 2,
            admin: this.adminid
        };
        batch.update(this.db.firestore.collection('hospitalvisits').doc(visit.id), visit);
        return batch.commit();
    }

    getinsuanceprice(procedure: MergedProcedureModel): number {
        // if (this.currentpatient.value.queuedata.paymentmethod) {
        //     if (procedure.customprocedure.insuranceprices[this.currentpatient.value.queuedata.paymentmethod]) {
        //
        //     }
        // }
        return 0;
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
                    if (f.length === 0) {
                        return of([]);
                    }
                    const visit: PatientVisit = Object.assign({...emptypatientvisit}, t.payload.doc.data(), {id: t.payload.doc.id});
                    return this.db.collection('patients').doc(visit.patientid).snapshotChanges().pipe(
                        switchMap(patientdata => {
                            if (!patientdata.payload.exists) {
                                // console.log(visit)
                                return of({...emptymergedQueueModel});
                            }
                            const patient: Patient = Object.assign(emptypatient, patientdata.payload.data(), {id: patientdata.payload.id});
                            // console.log(patient)
                            return of({patientdata: Object.assign({}, {...emptypatient}, patient), queuedata: visit});
                        })
                    );
                }));
            }),
            switchMap((val1: Array<MergedPatient_QueueModel>) => {
                console.log(val1);
                return combineLatest(...val1.map(t => {
                    if (val1.length === 0 || !t.patientdata.id) {
                        return of({...emptymergedQueueModel});
                    }
                    return this.db.collection('hospitals').doc(this.activehospitalid)
                        .collection('filenumbers')
                        .doc(t.patientdata.id)
                        .snapshotChanges()
                        .pipe().map(filedata => {
                            const file: HospFile = Object.assign({...emptyfile}, filedata.payload.data(), {id: t.patientdata.id});
                            t.patientdata.fileinfo = file;
                            return t;
                        });

                }));

            })
        ).subscribe(mergedData => {
            // console.log(mergedData);
            this.mainpatientqueue.next(mergedData);
        });
    }
}
