import {Injectable} from '@angular/core';
import {emptypatient, Patient} from '../../models/Patient';
import {PatientVisit, emptypatientvisit} from '../../models/PatientVisit';
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
import {map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest} from 'rxjs';

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
    hospitalpatients: BehaviorSubject<Array<Patient>> = new BehaviorSubject([]);

    constructor(private db: AngularFirestore, private hospitalservice: HospitalService, private adminservice: AdminService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                /**
                 * call the get hospital patients and invoke hospitalpatients
                 * **/
                this.getHospitalPatients();
            }
        });
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.data.uid) {
                this.userdata = admin;
            }
        });
    }

    getcurrentpatient(patientid ?): any {
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

    validatefileno(fileno: string): any {
        return this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('filenumbers').where('no', '==', fileno);
    }

    acceptpatient(patient: Patient): any {
        this.db.firestore.collection('patients').doc(patient.id).update({});
    }

    addpatientprocedure(procedurehistory: Procedureperformed): any {
        console.log(procedurehistory);
        return this.db.firestore.collection('History').doc(this.currentpatient.todayhistoryid).collection('procedures').add(procedurehistory);
    }

    addpatientnote(note: Patientnote): any {
        return this.db.firestore.collection('patients').doc(this.currentpatient.patientdata.id).collection('notes').add(note);
    }

    addpatientprescription(prescrip): any {
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
        const transformedNextOfKin = {
            name: nextofkin.name.toLowerCase(),
            relationship: nextofkin.relationship.toLowerCase(),
            phone: nextofkin.phone,
            workplace: nextofkin.workplace.toLowerCase()
        };

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
                name: personalinfo.firstname.toLowerCase() + ' ' + personalinfo.lastname.toLowerCase(),
                address: personalinfo.address.toLowerCase(),
                gender: personalinfo.gender,
                occupation: personalinfo.occupation.toLowerCase(),
                workplace: personalinfo.workplace.toLowerCase(),
                phone: personalinfo.phone,
                email: personalinfo.email.toLowerCase(),
                idno: personalinfo.idno,
                dob: moment(personalinfo.birth, 'MM/DD/YYYY').toDate(),
            },
            nextofkin: transformedNextOfKin,
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
            id: patientID,
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


    /**
     * get all patients
     * */
    getHospitalPatients(): void {
        this.db.collection('hospitals').doc(this.activehospital.id).collection('filenumbers', ref => ref.limit(100)).snapshotChanges().pipe(
            switchMap(f => {
                return combineLatest(...f.map(t => {
                    const hospitalfile = t.payload.doc.data() as HospFile;
                    hospitalfile.id = t.payload.doc.id;
                    return this.db.collection('patients').doc(hospitalfile.id).snapshotChanges().pipe(
                        map(patientdata => {
                            const patient = patientdata.payload.data() as Patient;
                            patient.id = patientdata.payload.id;
                            patient.fileinfo = hospitalfile;
                            return Object.assign({}, emptypatient, patient);
                        })
                    );
                }));
            })
        ).subscribe(mergedData => {
            this.hospitalpatients.next(mergedData);
        });
    }

    addPatientToQueue({type, description}: { type: string, description: string }, patient: Patient): Promise<void> {
        /**
         * add patient to queue
         * */
            // todays date
        const todayDate = moment().toDate();

        /**
         * patient document ID
         * **/
        const patientID = this.db.createId();

        const tempVisit = {
            paymentmethod: {
                type: type
            },
            visitdescription: description,
            patientid: patient.id,
            hospitalid: this.activehospital.id,
            timestamp: todayDate,
            id: patientID,
            checkin: {
                status: 0,
                admin: null
            }
        };

        /**
         * steps
         * 1. hospitalvisits
         * 2. filenumber last visit -- maybe when everything is done
         * 3.
         * */
        const combineData = Object.assign(emptypatientvisit, tempVisit);
        return this.db.collection('hospitalvisits').doc(patientID).set(combineData);
    }


    /***
     *
     * update patient
     * require
     * - patientID
     * - formData
     *
     *   return  Promise
     * */
    updatePatient(patientID: string, {personalinfo, insurance, nextofkin}: AddPatientFormModel): any {
        // get current data
        const patientDataRef = this.db.firestore.collection('patients').doc(patientID);

        this.db.firestore.runTransaction(transaction => {
            return transaction.get(patientDataRef).then(async sfDoc => {
                if (!sfDoc.exists) {
                    throw 'Document does not exist!';
                }

                /**
                 * get patient data
                 * */

                /**
                 * fetch patient file
                 * */

                const fileDataDoc = await this.db.firestore.collection('hospitals')
                    .doc(this.activehospital.id)
                    .collection('filenumbers')
                    .doc(patientID).get();


                const fileData = fileDataDoc.data() as HospFile;

                /*
                * current data of patient
                * **/
                const firstData = Object.assign(emptypatient, sfDoc.data(), {fileinfo: fileData});

                /**
                 * now write the update
                 * */

                    // todays date
                const todayDate = moment().toDate();

                const tempInsurance = insurance.map((value, index: number) => {
                    return {index: value};
                });

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
                        date: firstData.metadata.date,
                        lastedit: todayDate
                    }
                };

                const hospitalFileNumber = {
                    id: patientID,
                    date: firstData.fileinfo.date,
                    lastvisit: todayDate,
                    no: personalinfo.fileno,
                    idno: personalinfo.idno
                };

                const secondData = Object.assign(emptypatient, modifiedData, {fileinfo: hospitalFileNumber});

                /**
                 * updated data set, this should be the updated data
                 * */
                const updatedPatientData = Object.assign(firstData, secondData);

                /**
                 * do the transactions
                 * */

                const batched = [];
                batched.push(updatedPatientData);
                batched.push(updatedPatientData);


                const patientFileRef = this.db.firestore.collection('hospitals')
                    .doc(this.activehospital.id).collection('filenumbers').doc(patientID);

                // batch write the number of active patients
                const patientRef = this.db.firestore
                    .collection('patients').doc(patientID);


                /**
                 * return array
                 * */
                Promise.all(batched.map(async (item: Patient, index) => {
                    if (index === 0) {
                        await transaction.update(patientRef, modifiedData);
                    } else if (index === 1) {
                        await transaction.update(patientFileRef, hospitalFileNumber);
                    }
                }));

            });
        });

    }


}
