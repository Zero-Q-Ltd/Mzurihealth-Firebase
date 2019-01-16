import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HospitalService } from './hospital.service';
import { AdminService } from './admin.service';
import { BehaviorSubject } from 'rxjs';
import {Hospital} from '../../models/Hospital';
import {emptypatient, Patient} from '../../models/Patient';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {HospFile} from '../../models/HospFile';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  activehospital: Hospital;
  allpatientqueue: BehaviorSubject<Array<Patient>> = new BehaviorSubject([]);
  hospitaladmins: Array<HospitalAdmin> = [];
  userdata: HospitalAdmin;


  constructor(private db: AngularFirestore, private hospitalservice: HospitalService, private adminservice: AdminService) {
    this.hospitalservice.activehospital.subscribe(hospital => {
      if (hospital.id) {
        this.activehospital = hospital;
        this.getwholequeue();
      }
    });
    adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
      if (admin.data.uid) {
        this.userdata = admin;
      }
    });
  }
  //From reception to rest of admins or admins to admins
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

  async getwholequeue() {
    this.db.firestore.collection('hospitalvisits')
      .where(`hospitalid`, '==', this.activehospital.id)
      .where(`checkin.status`, '<=', 4)
      .onSnapshot(hospitalvisits => {
      let data = Promise.all(hospitalvisits.docs.map(async patientdata => {
        let patient = Object.assign({}, emptypatient, patientdata.data() as Patient);
        patient.id = patientdata.id;
        let patientfile = await this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('filenumbers').doc(patientdata.id).get();
        patient.fileinfo = patientfile.data() as HospFile;
        return patient;
      }));
      data.then(res => {
        this.allpatientqueue.next(res);
      });
    });

  }
}
