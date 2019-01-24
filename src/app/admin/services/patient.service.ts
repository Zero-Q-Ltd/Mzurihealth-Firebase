import {Injectable} from '@angular/core';
import {Patient, emptypatient} from '../../models/Patient';
import {PatientVisit} from '../../models/PatientVisit';
import {Patientnote} from '../../models/Patientnote';
import {Procedureperformed} from '../../models/Procedureperformed';
import {RawProcedure} from '../../models/RawProcedure';
import {Hospital} from '../../models/Hospital';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {HospitalService} from './hospital.service';
import {AdminService} from './admin.service';
import {AngularFirestore} from '@angular/fire/firestore';
import * as moment from 'moment';
import {HospFile} from '../../models/HospFile';
import {AddPatientFormModel} from '../../models/AddPatientForm.model';
import {firestore} from 'firebase';
import {Metadata} from '../../models/universal';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    currentpatient: {
        patientdata: Patient, patienthistory: PatientVisit[], todayhistoryid: string,
        patientnotes: Patientnote[], todayprocedures: Procedureperformed[]
    } = {
        patientdata: null,
        patienthistory: [],
        patientnotes: [],
        todayprocedures: [],
        todayhistoryid: null
    };
    caurrentpatientinvoice: {
        patientdata: Patient,
        todayprocedures: Map<string, { procedurehistory: Procedureperformed, procedureconfig: RawProcedure }>,
        todayhistory: PatientVisit,
    } = {
        patientdata: null,
        todayprocedures: new Map(),
        todayhistory: null,
    };
    activehospital: Hospital;
    userdata: HospitalAdmin;

    constructor(private db: AngularFirestore, private hospitalservice: HospitalService, private adminservice: AdminService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
            }
        });
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.data.uid) {
                this.userdata = admin;
            }
        });
    }

    getcurrentpatient(patientid ?) {
        if (patientid) {
            this.db.firestore.collection('patients').doc(patientid).onSnapshot(patientdata => {
                if (patientdata.exists) {
                    let temppatientdata = patientdata.data();
                    temppatientdata['id'] = patientdata.id;
                    // console.log(temppatientdata)
                    Object.assign(this.currentpatient.patientdata, temppatientdata);
                    this.db.firestore.collection('patients').doc(patientid).collection('notes')
                        .limit(10)
                        .onSnapshot(patientnotes => {
                            this.currentpatient.patientnotes = [];
                            if (!patientnotes.empty) {
                                patientnotes.forEach(note => {
                                    let patientnote = note.data() as Patientnote;
                                    this.currentpatient.patientnotes.push(Object.assign({}, patientnote));
                                });
                            }

                        });
                } else {
                    // console.log('empty patient !!!')
                    this.currentpatient = {
                        patientdata: null,
                        patienthistory: [],
                        patientnotes: [],
                        todayprocedures: [],
                        todayhistoryid: null
                    };
                }
            });
            this.db.firestore.collection('History')
                .where('patientid', '==', patientid)
                .orderBy('timestamp')
                .limit(10).onSnapshot(patienthistory => {
                // console.log(patientid ,patienthistory)
                // if(!patienthistory.empty){
                this.currentpatient.patienthistory = [];
                patienthistory.forEach(histo => {
                    const patienthistory = histo.data() as PatientVisit;
                    if (!patienthistory) {
                        this.currentpatient.todayhistoryid = histo.id;
                        this.db.firestore.collection('History').doc(histo.id).collection('procedures').onSnapshot(unsettledprocedures => {
                            if (!unsettledprocedures.empty) {
                                // unsettledprocedures.
                                this.currentpatient.todayprocedures = [];
                                unsettledprocedures.forEach(proceduredata => {
                                    // console.log(procedure.data())
                                    let procedure = proceduredata.data() as Procedureperformed;
                                    this.currentpatient.todayprocedures.push(Object.assign({}, procedure));
                                });
                            }
                        });
                    }
                    this.currentpatient.patienthistory.push(Object.assign({}, patienthistory));
                    // console.log(history.data())
                });
                // this.currentpatient.patientdata = this.objectassign(patientdata.data())
                // }
                // console.log('emptyhistory')
            });
        } else {
            //Reset the object
            this.currentpatient = {
                patientdata: null,
                patienthistory: [],
                patientnotes: [],
                todayprocedures: [],
                todayhistoryid: null
            };
        }

    }

    validatefileno(fileno: string) {
        return this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('filenumbers').where('no', '==', fileno);
    }

    // Add a new patient to the database
    addpatient(patientdata: Patient, newhistory: PatientVisit, saveandqueue: boolean, patientfile: HospFile) {
        let patientid = this.db.createId();
        let batch = this.db.firestore.batch();
        let timestamp = moment().toDate() as any;
        batch.set(this.db.firestore.collection('patients').doc(patientid), patientdata);
        if (saveandqueue) {
            {
                newhistory.hospitalid = this.activehospital.id;
                newhistory.patientid = patientid;
                newhistory.timestamp = timestamp;
                batch.set(this.db.firestore.collection('hospitalvisits').doc(this.db.createId()), newhistory);
            }
        }
        batch.update(this.db.firestore.collection('hospitals').doc(this.activehospital.id), {patientcount: this.activehospital.patientcount + 1});
        batch.set(this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('filenumbers').doc(patientid), patientfile);
        return batch.commit();
    }

    acceptpatient(patient: Patient) {
        this.db.firestore.collection('patients').doc(patient.id).update({});
    }

    addpatientprocedure(procedurehistory: Procedureperformed) {
        console.log(procedurehistory);
        return this.db.firestore.collection('History').doc(this.currentpatient.todayhistoryid).collection('procedures').add(procedurehistory);
    }

    addpatientnote(note: Patientnote) {
        return this.db.firestore.collection('patients').doc(this.currentpatient.patientdata.id).collection('notes').add(note);
    }

    addpatientprescription(prescrip) {
        console.log(prescrip);
        let batch = this.db.firestore.batch();
        batch.update(this.db.firestore.collection('History').doc(this.currentpatient.todayhistoryid), {prescription: prescrip, status: 2});
        let temp = {};

        batch.update(this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('queue').doc(this.userdata.data.uid),
            {
                [this.currentpatient.patientdata.id]: {
                    timestamp: Number(moment()),
                    status: 2
                }
            });
        let config = this.userdata.config;
        config.occupied = '';
        batch.update(this.db.firestore.collection('hospitaladmins').doc(this.userdata.data.uid), {config: config});
        return batch.commit();
    }


    /**
     * save patient to db
     * */
    savePatient({personalinfo, insurance, nextofkin}: AddPatientFormModel): Promise<void> {
        /**
         * create data to insert to the patient collection
         * */

        const tempInsurance = insurance.map((value, index: number) => {
            return {index: value};
        });

        // todays date
        const todayDate = moment().toDate();

        /**
         * patient document ID
         * **/
        const patientID = this.db.createId();


        const modifiedData = {
            id: patientID,
            personalinfo: {
                name: personalinfo.firstname + ' ' + personalinfo.lastname,
                address: personalinfo.address,
                gender: personalinfo.gender,
                occupation: personalinfo.occupation,
                workplace: personalinfo.workplace,
                phone: personalinfo.phone,
                email: personalinfo.email,
                idno: personalinfo.idno,
                dob: moment(personalinfo.birth, 'MM/DD/YYYY').toDate(),
            },
            nextofkin,
            insurance: tempInsurance,
            metadata: {
                date: todayDate,
                lastedit: todayDate
            }
        };

        /**
         * join objects to create a full document
         * */
        const patientDoc = Object.assign(emptypatient, modifiedData) as Patient;

        /**
         * hospital file number
         * */
        const hospitalFileNumber = {
            date: todayDate,
            lastvisit: todayDate,
            no: personalinfo.fileno,
            idno: personalinfo.idno
        };

        /**
         * start batch write
         * */
            // create batch
        const batch = this.db.firestore.batch();

        const patientRef = this.db.firestore
            .collection('patients').doc(patientID);

        batch.set(patientRef, patientDoc);


        // batch write Hospital file
        const patientFileRef = this.db.firestore.collection('hospitals')
            .doc(this.activehospital.id).collection('filenumbers').doc(patientID);
        batch.set(patientFileRef, hospitalFileNumber);


        // batch write the number of active patients
        const numberOfPatientsRef = this.db.firestore.collection('hospitals').doc(this.activehospital.id);
        batch.update(numberOfPatientsRef, {patientcount: this.activehospital.patientcount + 1});


        return batch.commit();
    }

}
