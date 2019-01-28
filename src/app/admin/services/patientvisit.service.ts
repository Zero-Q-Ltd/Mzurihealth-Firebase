import {Injectable} from '@angular/core';
import {QueueService} from './queue.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {emptypatientvisit, PatientVisit} from '../../models/PatientVisit';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientvisitService {
    patientid: string;
    hospitalid: string;
    patientvisits: BehaviorSubject<Array<PatientVisit>> = new BehaviorSubject<Array<PatientVisit>>([]);

    constructor(private queue: QueueService,
                private hospitalService: HospitalService,
                private db: AngularFirestore) {
        queue.currentpatient.subscribe(value => {
            if (value.patientdata.id) {
                this.patientid = value.patientdata.id;
                this.getpatientvisithistory();
            }
        });
        hospitalService.activehospital.subscribe(value => {
            this.hospitalid = value.id;
        });
    }

    /**
     * Fetches the last 100 records of the patient visit information to the current hospital
     */
    getpatientvisithistory(): void {
        if (!this.patientid || !this.hospitalid) {
            return;
        }
        this.db.firestore.collection('hospitalvisits')
            .where('hospitalid', '==', this.hospitalid)
            .where('patientid', '==', this.patientid)
            .limit(20)
            .onSnapshot(snapshot => {
                this.patientvisits.next(snapshot.docs.map(value => {
                    const visit: PatientVisit = Object.assign({}, emptypatientvisit, value.data());
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
