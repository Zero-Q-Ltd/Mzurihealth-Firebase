import {Injectable} from '@angular/core';
import {QueueService} from './queue.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {emptypatientvisit, PatientVisit} from '../../models/PatientVisit';
import {BehaviorSubject} from 'rxjs';
import {emptyproceduresperformed, Procedureperformed, Proceduresperformed} from '../../models/Procedureperformed';
import {MergedProcedureModel} from '../../models/MergedProcedure.model';
import {firestore} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class PatientvisitService {
    patientid: string;
    hospitalid: string;
    currentpatientid: string;
    visithistory: BehaviorSubject<Array<PatientVisit>> = new BehaviorSubject<Array<PatientVisit>>([]);
    currentvisitprocedures: BehaviorSubject<Proceduresperformed> = new BehaviorSubject<Proceduresperformed>({procedures: []});
    currentvisit: BehaviorSubject<PatientVisit> = new BehaviorSubject<PatientVisit>({...emptypatientvisit});
    adminid: string;

    constructor(private queue: QueueService,
                private hospitalService: HospitalService,
                private db: AngularFirestore) {
        queue.currentpatient.subscribe(value => {
            if (value.patientdata.id) {
                this.patientid = value.patientdata.id;
                this.fetchvisithistory();
            }
        });
        this.currentvisit.subscribe(visit => {
            if (visit.id) {
                this.fetchvisitprocedures(visit.id);
            }
        });
        hospitalService.activehospital.subscribe(value => {
            this.hospitalid = value.id;
        });

    }

    /**
     * Fetches list of procedures belonging to the id provided
     */
    fetchvisitprocedures(id: string): void {
        this.db.firestore.collection('visitprocedures')
            .doc(id)
            .onSnapshot(snapshot => {
                const procedures: Proceduresperformed = Object.assign({}, {...emptyproceduresperformed}, snapshot.data());
                this.currentvisitprocedures.next(procedures);
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
        per.visitid = this.currentpatientid;

        console.log(procedure, per);
        if (this.currentvisitprocedures.value.procedures.length === 0) {
            this.db.collection('visitprocedures').doc(this.currentvisit.value.id).set({
                procedures: [per]
            });
        } else {
            this.db.collection('visitprocedures').doc(this.currentvisit.value.id).update({
                procedures: firestore.FieldValue.arrayUnion(per)
            });
        }

    }

    fetchvisithistory(): void {
        this.db.firestore.collection('hospitalvisits')
            .where('hospitalid', '==', this.hospitalid)
            .where('patientid', '==', this.currentpatientid)
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


    createpatientvisit(): any {

    }

    editpatientvisit(): any {

    }

    terminatepatientvisit(): any {

    }


}
