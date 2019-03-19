import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MergedPatient_QueueModel} from '../../models/MergedPatient_Queue.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {emptypatientvisit, PatientVisit} from '../../models/PatientVisit';
import {emptypatient, Patient} from '../../models/Patient';
import * as moment from 'moment';
import {emptyfile, HospFile} from '../../models/HospFile';

@Injectable({
    providedIn: 'root'
})
export class PaymentHistoryService {
    activehospitalid: string;
    paymentshistory: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);

    constructor(private db: AngularFirestore, private hospitalservice: HospitalService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospitalid = hospital.id;
                this.gethistory('week');
            }
        });
    }

    /**
     *fetches patientvisit and merges it with hospital file info and patient info
     */
    gethistory(timeframe: 'week' | 'month' | 'year'): void {
        this.paymentshistory.next([]);
        this.db.firestore.collection('hospitalvisits')
            .where('hospitalid', '==', this.activehospitalid)
            .where('checkin.status', '==', 4)
            .where('metadata.date', '>=', this.timeframetodate(timeframe))
            .get().then(async value => {
            Promise.all(value.docs.map(async docdata => {
                console.log(docdata.data());
                const visit: PatientVisit = Object.assign({...emptypatientvisit}, docdata.data(), {id: docdata.id});
                return this.db.firestore.collection('patients').doc(visit.patientid).get().then(async value1 => {
                    const patient: Patient = Object.assign({...emptypatient}, value1.data(), {id: value1.id});
                    const filedata = await this.db.firestore.collection('hospitals').doc(this.activehospitalid)
                        .collection('filenumbers')
                        .doc(patient.id)
                        .get();
                    console.log(patient);
                    const file: HospFile = Object.assign({...emptyfile}, filedata.data(), {id: filedata.id});
                    patient.fileinfo = file;
                    return {queuedata: visit, patientdata: patient};
                });

            })).then(res => {
                console.log(res);
                this.paymentshistory.next(res);
            });
        });
    }

    private timeframetodate(timeframe: 'week' | 'month' | 'year'): Date {
        switch (timeframe) {
            case 'week' :
                return moment().subtract(1, 'week').toDate();
            case 'month':
                return moment().subtract(1, 'month').toDate();
            default :
                return moment().subtract(1, 'year').toDate();
        }
    }

}
