import {Injectable} from '@angular/core';
import {emptypatient, Patient} from '../../models/Patient';
import {emptypatientvisit} from '../../models/PatientVisit';
import {Hospital} from '../../models/Hospital';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {HospitalService} from './hospital.service';
import {AdminService} from './admin.service';
import {AngularFirestore} from '@angular/fire/firestore';
import * as moment from 'moment';
import {emptyfile, HospFile} from '../../models/HospFile';
import {AddPatientFormModel} from '../../models/AddPatientForm.model';
import {map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import 'rxjs/add/observable/empty';
import {PaymentChannel} from '../../models/PaymentChannel';
import {firestore} from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

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


    getSinglePatient(patientID: string): Observable<Patient> {
        return this.db.collection('patients').doc(patientID).snapshotChanges().pipe(
            map(action => {
                return Object.assign(emptypatient, action.payload.data()) as Patient;
            })
        );
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
            return {id: value.id, insuranceno: value.insurancenumber};
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
        const patientDoc = Object.assign({...emptypatient}, modifiedData) as Patient;

        /**
         * hospital file number
         * */
        const hospitalFileNumberTemp = {
            id: patientID,
            date: todayDate,
            lastvisit: todayDate,
            no: personalinfo.fileno,
            idno: personalinfo.idno
        };

        const hospitalFileNumber = Object.assign({...emptyfile}, hospitalFileNumberTemp);


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
        this.db.collection('hospitals').doc(this.activehospital.id)
            .collection('filenumbers', ref => ref.limit(100)).snapshotChanges().pipe(
            switchMap(f => {
                return combineLatest(...f.map(t => {
                    const hospitalfile = t.payload.doc.data() as HospFile;
                    hospitalfile.id = t.payload.doc.id;
                    return this.db.collection('patients').doc(hospitalfile.id).snapshotChanges().pipe(
                        map(patientdata => {
                            if (!patientdata.payload.exists) {
                                return {...emptypatient};
                            }
                            const patient = patientdata.payload.data() as Patient;
                            patient.id = patientdata.payload.id;
                            patient.fileinfo = hospitalfile;
                            return Object.assign({}, emptypatient, patient);
                        })
                    );
                }));
            })
        ).subscribe(mergedData => {
            this.hospitalpatients.next(mergedData.sort((a: Patient, b: Patient) => {
                return this.getTime(a.metadata.date.toDate()) - this.getTime(b.metadata.date.toDate());
            }));
        });
    }

    private getTime(date?: Date): any {
        return date != null ? date.getTime() : 0;
    }

    addPatientToQueue({type, description, insurance}: {
                          type: PaymentChannel,
                          description: string, insurance: Array<{ insuranceControl: string; insurancenumber: string; }>
                      }, patient: Patient,
                      selected: { insuranceControl: string, insurancenumber: string }): Promise<void> {
        /**
         * add patient to queue
         * */
            // todays date
        const todayDate = firestore.Timestamp.now();

        /**
         * patient document ID
         * **/
        const queueID = this.db.createId();


        /**
         * steps
         * 1. hospitalvisits
         * 2. filenumber last visit -- maybe when everything is done
         * 3.
         * */



        const visitTemp = {
            visitdescription: description,
            patientid: patient.id,
            hospitalid: this.activehospital.id,
            metadata: {
                date: todayDate,
                lastedit: todayDate
            },
            payment: {
                hasinsurance: type.name === 'insurance',
                splitpayment: false,
                status: false,
                total: 0,
                singlepayment: {
                    channelid: type.id,
                    amount: 0,
                    methidid: type.name === 'insurance' ? selected.insuranceControl : null,
                    transactionid: null
                }

            },
            id: queueID,
            checkin: {
                status: 0,
                admin: null
            }
        };

        const combineData = Object.assign(emptypatientvisit, visitTemp);


        console.log('..............................................................');

        console.log('type');
        console.log(type);
        console.log('description');
        console.log(description);
        console.log('insurance');
        console.log(insurance);
        console.log('patient');
        console.log(patient);
        console.log('selected');
        console.log(selected);


        // Get a new write batch
        const batch = this.db.firestore.batch();
        const hospitalVisitRef = this.db.firestore.collection('hospitalvisits').doc(queueID);
        batch.set(hospitalVisitRef, combineData);


        // const
        // store insurance
        const tempInsurance = insurance.map((value, index: number) => {
            return {id: value.insuranceControl, insuranceno: value.insurancenumber};
        });

        const patientRef = this.db.firestore
            .collection('patients').doc(patient.id);

        batch.update(patientRef, {patient, insurance: tempInsurance});

        // TODO: use transactions with promise.all
        // increment the visit count
        const hospitalFileRef = this.db.firestore.collection('hospitals')
            .doc(this.activehospital.id).collection('filenumbers').doc(patient.id);


        batch.update(hospitalFileRef, Object.assign(patient.fileinfo, {visitcount: patient.fileinfo.visitcount + 1}));

        return batch.commit();
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
                    Promise.reject('Document does not exist!');
                    return;
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

                console.log(insurance);
                const tempInsurance = insurance.map((value, index: number) => {
                    return {id: value.id, insuranceno: value.insurancenumber};
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

    searchPatient(field: string, value: string): any {

        /*
        * searchable items
        * - file number
        * - Id number
        * - mobile number
        * - name
        * **/

        if (field === 'no' || field === 'idno') {
            this.searchFromHospitalFile(field, value);
        } else if (field === 'phone' || field === 'name') {
            this.searchFromPatients(field, value);
        }
    }

    private searchFromHospitalFile(field: string, value: string): any {
        /**
         * search filenumber
         * search id
         * */
        this.db.collection('hospitals')
            .doc(this.activehospital.id)
            .collection('filenumbers', ref => {
                return ref.where(field, '==', value);
            }).snapshotChanges().pipe(
            switchMap(f => {
                if (f.length === 0) {
                    return of([]);
                }
                return combineLatest(...f.map(t => {
                    console.log('inside patient t');
                    console.log(t);
                    const fileInfo = t.payload.doc.data() as HospFile;

                    return this.db.collection('patients').doc(fileInfo.id).snapshotChanges().pipe(
                        map(patientData => {
                            console.log('inside patient data');
                            console.log(patientData);
                            return Object.assign(emptypatient, patientData.payload.data(), {fileinfo: fileInfo});
                        })
                    );
                }));

            })
        ).subscribe(mergedData => {
            this.hospitalpatients.next(mergedData);
        });


    }

    private searchFromPatients(field: string, value: string): any {
        /**
         * search mobile number
         * search name
         * */

        // TODO: make sure something is done if the patient has no file number
        this.db.collection('patients', ref => {
            return ref.where(`personalinfo.${field}`, '==', value);
        }).snapshotChanges().pipe(
            switchMap(f => {
                if (f.length === 0) {
                    of([]);
                }
                return combineLatest(...f.map(t => {

                    const patient = Object.assign(emptypatient, t.payload.doc.data());

                    return this.db.collection('hospitals')
                        .doc(this.activehospital.id)
                        .collection('filenumbers').doc(patient.id).snapshotChanges()
                        .pipe(
                            map(fileData => {
                                // TODO: return null if no patient
                                const patientFileData = fileData.payload.data() as HospFile;
                                patient.fileinfo = patientFileData;

                                return patient;
                            })
                        );
                }));
            })
        ).subscribe(mergedData => {
            this.hospitalpatients.next(mergedData);
        });

    }

    /*
    * update
    * **/

    updateVitalsAllegiesConditions(patientID: string, vitals, conditions: Array<any>, allegies: Array<any>): any {
        // get current user
        const patientsDocRef = this.db.firestore.collection('patients').doc(patientID);

        return this.db.firestore.runTransaction(transaction => {
            return transaction.get(patientsDocRef).then(patientDoc => {
                if (!patientDoc.exists) {
                    Promise.reject('No such document');
                    return;
                }

                const patientData = Object.assign(emptypatient, patientDoc.data()) as Patient;

                let tempMeta = null;
                if (patientData.medicalinfo.metadata.date === null) {
                    tempMeta = {
                        date: moment().toDate(),
                        lastedit: moment().toDate()
                    };
                } else {
                    tempMeta = {
                        date: patientData.medicalinfo.metadata.date,
                        lastedit: moment().toDate()
                    };
                }

                transaction.update(patientsDocRef, Object.assign(patientData, {
                    medicalinfo: {
                        vitals,
                        conditions,
                        allergies: allegies,
                        metadata: tempMeta
                    }
                }));
            });
        });
    }

}
