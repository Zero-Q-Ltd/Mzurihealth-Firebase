import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    constructor(private db: AngularFirestore,) {
    }

    // payinvoice(adminid) {
    //     let batch = this.db.firestore.batch();
    //     console.log(this.caurrentpatientinvoice.patientdata.id);
    //     console.log(adminid);
    //     console.log(this.caurrentpatientinvoice.todayhistory);
    //     if (this.caurrentpatientinvoice.todayhistory.paid) {
    //         console.log('submitting');
    //         batch.update(this.db.firestore.collection('History').doc(this.caurrentpatientinvoice.todayhistory.id), this.caurrentpatientinvoice.todayhistory);
    //     }
    //     return batch.commit();
    // }
    //
    // getpatientinvoice(patientid) {
    //     this.caurrentpatientinvoice = {
    //         patientdata: null,
    //         todayprocedures: new Map(),
    //         todayhistory: null
    //
    //     };
    //     if (patientid) {
    //         this.db.firestore.collection('patients').doc(patientid).onSnapshot(patientdata => {
    //             if (patientdata.exists) {
    //                 let temppatientdata = patientdata.data();
    //                 temppatientdata['id'] = patientdata.id;
    //                 // console.log(temppatientdata)
    //                 // this.caurrentpatientinvoice.patientdata = this.objectassign(temppatientdata, emptypatient)
    //                 this.caurrentpatientinvoice.patientdata = emptypatient;
    //                 _.extend(this.caurrentpatientinvoice.patientdata, temppatientdata);
    //                 // I had to nest this so that we are sure the patient data is already loaded by the time the history is being fetched
    //                 this.db.firestore.collection('History')
    //                     .where('patientid', '==', patientid)
    //                     .orderBy('timestamp')
    //                     .limit(1).onSnapshot(patienthistory => {
    //                     // console.log(patientid ,patienthistory)
    //                     // if(!patienthistory.empty){
    //                     patienthistory.forEach(history => {
    //                         let temphisto = history.data();
    //                         temphisto['id'] = history.id;
    //                         if (!temphisto['paid']) {
    //                             this.caurrentpatientinvoice.todayhistory = emptypatienthistory;
    //                             _.extend(this.caurrentpatientinvoice.todayhistory, temphisto);
    //                             this.db.firestore.collection('History').doc(temphisto.id).collection('procedures').onSnapshot(unsettledprocedures => {
    //                                 if (!unsettledprocedures.empty) {
    //                                     // unsettledprocedures.
    //
    //                                     this.caurrentpatientinvoice.todayprocedures = new Map(),
    //
    //                                         unsettledprocedures.forEach(procedure => {
    //                                             // console.log(procedure.data())
    //                                             let tempProcedures = procedure.data();
    //                                             if (tempProcedures['paymentmethod'] == null) {
    //                                                 console.log('is null');
    //                                                 tempProcedures['paymentmethod'] = [];
    //                                                 tempProcedures['paymentmethod'].push(this.caurrentpatientinvoice.todayhistory.paymentmethod);
    //                                             }
    //                                             console.log(tempProcedures);
    //                                             // this.caurrentpatientinvoice.todayprocedures.push(this.objectassign(tempProcedures, emptypatienthistory))
    //                                             this.db.firestore.collection('procedures').doc(tempProcedures.id).collection('hospitalconfigs').doc(this.activehospital.id).get().then(procedureconfig => {
    //                                                 if (procedureconfig.exists) {
    //                                                     let tempconfig = procedureconfig.data();
    //                                                     tempconfig['id'] = procedureconfig.id;
    //                                                     console.log(tempconfig);
    //                                                     let tempconfig2 = emptyprawrocedure;
    //                                                     let emptyhisto = emptypatienthistory;
    //                                                     // this.caurrentpatientinvoice.todayprocedures.set(tempProcedures.id, { procedureconfig: this.objectassign(tempconfig), procedurehistory: this.objectassign(tempProcedures, emptypatienthistory) })
    //                                                     this.caurrentpatientinvoice.todayprocedures.set(tempProcedures.id,
    //                                                         {procedureconfig: _.extend(tempconfig2, tempconfig), procedurehistory: _.extend(emptyhisto, tempProcedures)});
    //                                                 } else {
    //                                                     //this procedure has been deleted
    //                                                 }
    //
    //                                             });
    //                                         });
    //                                 }
    //                             });
    //                         }
    //                         // console.log(history.data())
    //                     });
    //                     // this.currentpatient.patientdata = this.objectassign(patientdata.data())
    //                     // }
    //                     // console.log('emptyhistory')
    //                 });
    //             } else {
    //                 // console.log('empty patient !!!')
    //                 this.caurrentpatientinvoice = {
    //                     patientdata: null,
    //                     todayprocedures: new Map(),
    //                     todayhistory: null
    //                 };
    //             }
    //         });
    //
    //     } else {
    //         //Reset the object
    //         this.caurrentpatientinvoice = {
    //             patientdata: null,
    //             todayprocedures: new Map(),
    //             todayhistory: null
    //         };
    //     }
    // }
}
