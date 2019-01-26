import {Component, Inject, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {InsuranceCompany} from '../../../models/InsuranceCompany';
import {MAT_DIALOG_DATA} from '@angular/material';
import {NotificationService} from '../../../shared/services/notifications.service';
import {InsuranceService} from '../../services/insurance.service';
import {AdminService} from '../../services/admin.service';
import {PatientService} from '../../services/patient.service';
import {HospitalService} from '../../services/hospital.service';
import {emptyhospital, Hospital} from '../../../models/Hospital';
import {emptypatienthistory, PatientVisit} from '../../../models/PatientVisit';
import {emptypatient, Patient} from '../../../models/Patient';
import {emptyfile, HospFile} from '../../../models/HospFile';
import * as moment from 'moment';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AddComponent implements OnInit {
    patientfileno: HospFile = Object.assign({}, emptyfile);
    temppatient: Patient = emptypatient;
    temphistory: PatientVisit = emptypatienthistory;
    activehospital: Hospital = Object.assign({}, emptyhospital);
    allInsurance: InsuranceCompany[];
    patientsForm: FormGroup;

    filteredOptions: Observable<InsuranceCompany[]>;

    private personalinfo: FormGroup;
    private nextofkin: FormGroup;
    private insurance: FormArray;
    // doctor will do this
    // private medicalinfo: FormGroup;

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private formBuilder: FormBuilder,
                private hospitalservice: HospitalService,
                private insuranceservice: InsuranceService,
                private router: Router,
                private notificationservice: NotificationService,
                @Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {


        /**
         * initialize forms
         * */
        this.initFormBuilder();

        /*
        * get list of insurance in kenya
        * */
        this.insuranceservice.allinsurance.subscribe(insurances => {
            this.allInsurance = insurances;
        });


        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.patientfileno.no = (hospital.patientcount + 1).toString();

                /**
                 * set the form data and disable it
                 * */
                this.patientsForm.controls['personalinfo']
                    .get('fileno').patchValue(this.patientfileno.no);

                this.patientsForm.controls['personalinfo']
                    .get('fileno').disable({onlySelf: true});
            }
        });


        /**
         *
         * */
        this.insurancechanges();

    }

    getTime(): any {
        return moment().format('LLL');
    }

    ngOnInit(): void {
    }


    /**
     * Init form values inside a here.
     * */
    private initFormBuilder(): void {

        /**
         * personal information
         * */
        const firstname = new FormControl('', Validators.required);
        const lastname = new FormControl('', Validators.required);
        const occupation = new FormControl('');
        const idno = new FormControl('', Validators.required);
        const gender = new FormControl('', Validators.required);
        const birth = new FormControl('', Validators.required);
        const email = new FormControl('', Validators.compose([
            Validators.required,
            Validators.email
        ]));
        const userWorkplace = new FormControl('', Validators.required);
        const userPhone = new FormControl('', Validators.required);
        const address = new FormControl('', Validators.compose([
            Validators.required
        ]));

        const fileno = new FormControl('', Validators.required);

        this.personalinfo = new FormGroup({
            firstname: firstname,
            lastname: lastname,
            occupation: occupation,
            idno: idno,
            gender: gender,
            birth: birth,
            email: email,
            workplace: userWorkplace,
            phone: userPhone,
            address: address,
            fileno: fileno
        });


        /**
         * next of kin
         * **/

        const relationship = new FormControl('', Validators.required);
        const kinName = new FormControl('', Validators.required);
        const kinPhone = new FormControl('', Validators.required);
        const kinWorkplace = new FormControl('', Validators.required);

        this.nextofkin = new FormGroup({
            relationship: relationship,
            name: kinName,
            phone: kinPhone,
            workplace: kinWorkplace
        });

        /*
        * insurance initial
        * https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/
        * **/

        this.patientsForm = this.formBuilder.group({
            insurance: this.formBuilder.array([this.createInsurance()]),
            nextofkin: this.nextofkin,
            personalinfo: this.personalinfo
        });


        /*
        * init the insurance list
        * **/
        this.insurance = this.patientsForm.get('insurance') as FormArray;
    }


    submitPatientsForm(): void {
        if (this.patientsForm.valid) {
            this.patientservice.savePatient(this.patientsForm.getRawValue()).then(() => {
                console.log('patient added successfully');
                this.router.navigate(['admin/patients/all']);
            });
        } else {
            this.notificationservice.notify({
                alert_type: 'error',
                body: 'Please fill all the required inputs',
                title: 'ERROR',
                placement: 'center'
            });
        }
    }

    createInsurance(): FormGroup {
        const insurancex = new FormControl('');

        const insurancenumber = new FormControl({
            value: '',
            disabled: true
        });

        return this.formBuilder.group({
            id: insurancex,
            insurancenumber: insurancenumber
        });
    }

    insurancechanges(): void {

        this.insurance.controls.forEach(x => {
            x.get('id').valueChanges.subscribe(g => {
                if (g) {
                    if (x.get('id').value.toString().length > -1) {
                        x.get('insurancenumber').enable({emitEvent: false});
                    } else {
                        x.get('insurancenumber').disable({emitEvent: false});
                    }
                }
            });
        });
    }

    addInsurance(): void {
        this.insurance.push(this.createInsurance());
        this.insurancechanges();
    }

    addpatient(saveandqueue: boolean) {
        if (saveandqueue) {
            // this.temppatient.checkin[this.activehospital.id] = {
            //     superadmin: null,
            //     status: 0
            // };
        }
        this.patientservice.validatefileno(this.patientfileno.no).get().then(data => {
            if (data.empty) {
                this.patientfileno.date = this.patientfileno.lastvisit = moment().toDate() as any;
                this.patientservice.addpatient(this.temppatient, this.temphistory, saveandqueue, this.patientfileno).then(() => {
                    this.notificationservice.notify({
                        alert_type: 'success',
                        body: 'Patient registration successful',
                        title: 'Success',
                        placement: 'center'
                    });
                    this.temppatient = emptypatient;
                });
            } else {

            }
        });

    }

}