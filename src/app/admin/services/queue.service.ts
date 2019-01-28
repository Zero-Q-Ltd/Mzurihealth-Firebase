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
import {MergedPatient_QueueModel, mergedQueueModel} from '../../models/MergedPatient_Queue.model';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    activehospital: Hospital;
    allpatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);
    mypatientqueue: BehaviorSubject<Array<MergedPatient_QueueModel>> = new BehaviorSubject([]);

    currentpatient: BehaviorSubject<MergedPatient_QueueModel> = new BehaviorSubject({...mergedQueueModel});

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
                if (this.userdata.config.occupied) {
                    this.filterqueue(patientid);
                }
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
            .where('status', '<', 4))
            .snapshotChanges().pipe(
            switchMap(f => {
                return combineLatest(...f.map(t => {
                    const visit = t.payload.doc.data() as PatientVisit;
                    visit.id = t.payload.doc.id;
                    return this.db.collection('patients').doc(visit.patientid).snapshotChanges().pipe(
                        map(patientdata => {
                            const patient = patientdata.payload.data() as Patient;
                            patient.id = patientdata.payload.id;
                            return {patientdata: Object.assign({}, emptypatient, patient), queuedata: visit};
                        })
                    );
                }));
            })
        ).subscribe(mergedData => {
            this.allpatientqueue.next(mergedData);
        });
    }

    filterqueue(adminid?: string): void {
        if (adminid) {
            this.allpatientqueue.subscribe(queuedata => {
                this.mypatientqueue.next(queuedata.filter(queue => {
                    const equality = queue.queuedata.checkin.admin === this.userdata.id;
                    if (equality && queue.queuedata.checkin.status === 3) {
                        this.currentpatient.next(queue);
                    }
                    return equality;

                }));
            });

        } else {
            return null;
        }
    }

    // From reception to rest of admins or admins to admins
    assignadmin(patient: Patient, adminid ?: string,) {
        // console.log(patientid)
        // console.log(adminid)
        // console.log(queuedata)
        // queuedata['timestamp'] = Number(moment());
        // queuedata['status'] = 0;
        // let tempqueue = {};
        // tempqueue[patientid] = queuedata;
        // let empty = {};
        // empty[patientid] = firestore.FieldValue.delete();
        // let batch = this.db.firestore.batch();
        //
        // this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('queue').doc(origin).update({
        //   [patientid]: firestore.FieldValue.delete()
        // }).then(result => {
        //   console.log(result);
        // });
        //
        // batch.update(this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('queue').doc(origin), empty);
        //
        // if (this.allpatientqueue.get(adminid)) {
        //   batch.update(this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('queue').doc(adminid), tempqueue);
        // } else {
        //   batch.set(this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('queue').doc(adminid), tempqueue);
        // }
        // return batch.commit();
    }

}
