import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {AdminService} from './admin.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {Hospital} from '../../models/Hospital';
import {emptypatient, Patient} from '../../models/Patient';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {PatientService} from './patient.service';
import {map, switchMap} from 'rxjs/operators';
import {PatientVisit} from '../../models/PatientVisit';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../models/MergedPatient_Queue.model';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    activehospital: Hospital;
    mainpatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    mypatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    currentpatient: BehaviorSubject<MergedPatient_QueueModel> = new BehaviorSubject({...emptymergedQueueModel});
    hospitaladmins: Array<HospitalAdmin> = [];
    userdata: HospitalAdmin;


    constructor(private db: AngularFirestore,
                private hospitalservice: HospitalService,
                private adminservice: AdminService,
                private patientservice: PatientService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.getwholequeue();
            }
        });
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.data.uid) {
                this.userdata = admin;
                const patientid = this.userdata.config.occupied;
                if (admin.config.occupied) {
                    // const val = this.mypatientqueue.value.find(value => {
                    //     return value.patientdata.id === admin.config.occupied;
                    // });
                    // this.currentpatient.next(val ? val : {...emptymergedQueueModel});
                } else {
                    this.currentpatient.next({...emptymergedQueueModel});
                }
                this.filterqueue();
            }
        });
    }

    /**
     *
     */
    private getwholequeue(): void {
        /**
         *  ref => {
            ref.where('status', '<', 4);
            ref.where('hospitalid', '==', this.activehospital.id);
        }
         */
        this.db.collection('hospitalvisits', ref => ref
            .where('hospitalid', '==', this.activehospital.id)
            .where('checkin.status', '<', 4))
            .snapshotChanges().pipe(
            switchMap(f => {
                return combineLatest(...f.map(t => {
                    const visit = t.payload.doc.data() as PatientVisit;
                    visit.id = t.payload.doc.id;
                    return this.db.collection('patients').doc(visit.patientid).snapshotChanges().pipe(
                        map(patientdata => {
                            const patient: Patient = Object.assign({}, emptypatient, patientdata.payload.data());
                            patient.id = patientdata.payload.id;
                            return {patientdata: Object.assign({}, emptypatient, patient), queuedata: visit};
                        })
                    );
                }));
            })
        ).subscribe(mergedData => {
            this.mainpatientqueue.next(mergedData);
        });
    }

    manualfilterqueue(): void {
        this.mypatientqueue.next(this.mainpatientqueue.value.filter(queue => {
            const equality = queue.queuedata.checkin.admin === this.userdata.id;
            if (equality && (queue.queuedata.patientid === this.userdata.config.occupied)) {
                console.log('00');
                this.currentpatient.next(queue);
            }
            return equality;
        }));
    }

    /**
     * filters the queue to find the doc's queue as well as his current patient
     */
    filterqueue(): void {
        this.mainpatientqueue.subscribe(queuedata => {
            this.mypatientqueue.next(queuedata.filter(queue => {
                const equality = queue.queuedata.checkin.admin === this.userdata.id;
                console.log(equality, queue.queuedata.patientid === this.userdata.config.occupied);
                if (queue.queuedata.patientid === this.userdata.config.occupied) {
                    console.log('00');
                    this.currentpatient.next(queue);
                }
                return queue.queuedata.checkin.admin === this.userdata.id;
            }));
        });

    }

    // From reception to rest of admins or admins to admins
    assignadmin(visit: PatientVisit, adminid: string): Promise<void> {

        const batch = this.db.firestore.batch();
        batch.update(this.db.firestore.collection('hospitalvisits').doc(visit.id), visit);

        return batch.commit();
    }

}
