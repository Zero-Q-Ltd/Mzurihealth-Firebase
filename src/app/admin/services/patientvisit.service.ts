import {Injectable} from '@angular/core';
import {QueueService} from './queue.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {emptypatientvisit, PatientVisit} from '../../models/PatientVisit';
import {BehaviorSubject} from 'rxjs';
import {emptyproceduresperformed, Procedureperformed, Proceduresperformed} from '../../models/Procedureperformed';
import {MergedProcedureModel} from '../../models/MergedProcedure.model';
import {firestore} from 'firebase';
import {AdminService} from './admin.service';

@Injectable({
    providedIn: 'root'
})
export class PatientvisitService {
    patientid: string;
    hospitalid: string;
    visithistory: BehaviorSubject<Array<PatientVisit>> = new BehaviorSubject<Array<PatientVisit>>([]);
    currentvisit: BehaviorSubject<PatientVisit> = new BehaviorSubject<PatientVisit>({...emptypatientvisit});
    adminid: string;

    constructor(private queue: QueueService,
                private adminservice: AdminService,
                private hospitalService: HospitalService,
                private db: AngularFirestore) {
        /*** DANGEROUS TERRITORY ****
         * the order of calling these functions is very important,
         * because if hospitalid is missing some queries that execute later might fail
         */
        this.adminservice.observableuserdata.subscribe(admin => {
            this.adminid = admin.id;
        });
        hospitalService.activehospital.subscribe(value => {
            this.hospitalid = value.id;
        });
        queue.currentpatient.subscribe(value => {
            if (value.patientdata.id) {
                this.patientid = value.patientdata.id;
                this.fetchvisithistory();
            }
        });

    }


    /**
     * @param procedure
     * @param per
     */
    addprocedure(procedure: MergedProcedureModel, per: Procedureperformed): void {
        per.name = procedure.rawprocedure.name;
        per.metadata = {
            lastedit: firestore.Timestamp.now(),
            date: firestore.Timestamp.now()
        };
        per.adminid = this.adminid;
        per.procedureid = procedure.rawprocedure.id;
        per.visitid = this.patientid;
        console.log(per);
        console.log(this.currentvisit.value);
        this.db.collection('visitprocedures').doc(this.currentvisit.value.id).update({
            procedures: firestore.FieldValue.arrayUnion(per)
        });
    }

    fetchvisithistory(): void {
        this.db.firestore.collection('hospitalvisits')
            .where('hospitalid', '==', this.hospitalid)
            .where('patientid', '==', this.patientid)
            .orderBy('metadata.date', 'asc')
            .limit(10)
            .onSnapshot(snapshot => {
                this.visithistory.next(snapshot.docs.map(value => {
                    const visit = Object.assign({}, {...emptypatientvisit}, value.data());
                    if (!visit.payment.status) {
                        this.currentvisit.next(visit);
                    }
                    visit.id = value.id;
                    return visit;
                }));
            });
    }

    /**
     *
     * @param newpatient determines the status so we can distinguish completely new patients and returning ones
     * @param description
     */
    createpatientvisit(newpatient: boolean, description: string): any {
        const visit: PatientVisit = {...emptypatientvisit};
        visit.checkin = {
            admin: this.adminid,
            status: newpatient ? 0 : 1
        };
        visit.invoiceid = this.hospitalService.activehospital.value.invoicecount + 1;
        visit.metadata = {
            lastedit: firestore.Timestamp.now(),
            date: firestore.Timestamp.now()
        };
        visit.hospitalid = this.hospitalid;
        visit.visitdescription = description;
        return this.db.collection('hospitalvisits').add(visit);
    }

    editpatientvisit(visit: PatientVisit): any {
        return this.db.collection('hospitalvisits').doc(visit.id).update(visit);
    }

    awaitpayment(visitid): any {
        return this.db.collection('hospitalvisits').doc(visitid).update({
            checkin: {
                status: 3,
                admin: null,
            }
        });
    }

    terminatepatientvisit(visitid): any {
        return this.db.collection('hospitalvisits').doc(visitid).update({
            checkin: {
                status: 4,
                admin: null,
            }
        });
    }


}
