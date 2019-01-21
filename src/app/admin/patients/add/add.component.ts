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
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {Observable} from 'rxjs';
import {InsuranceValidator} from '../../validators/insurance.validator';
import {map, startWith} from 'rxjs/operators';

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
                private notificationservice: NotificationService,
                @Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {

        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.patientfileno.no = (hospital.patientcount + 1).toString();
            }
        });


        /**
         * initialize forms
         * */
        this.initFormBuilder();

        /*
        * get list of insurance in kenya
        * */
        this.insuranceservice.allinsurance.subscribe(insurances => {
            this.allInsurance = insurances;
            // iterate the whole array and set validators
            for (const formG of this.insurance.controls) {
                formG.get('insurance').setValidators([
                    InsuranceValidator.available(insurances),
                    this.shouldEnableInsuranceNumber.bind(this)]);

                formG.get('insurance').updateValueAndValidity();
            }
        });


    }

    getTime(): any {
        return moment().format('LLL');
    }

    ngOnInit(): void {
        this.filterInsurance();
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
            Validators.required,
            Validators.email
        ]));

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
            address: address
        });


        /**
         * next of kin
         * **/

        const relationship = new FormControl('', Validators.required);
        const kinName = new FormControl('', Validators.required);
        const kinPhone = new FormControl('', Validators.required);
        const kinWorkplace = new FormControl('', Validators.required);

        this.nextofkin = new FormGroup({
            relationship,
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

    /**
     * filter and return an object
     * */
    private _filter(value: string): InsuranceCompany[] {
        const filterValue = value.toLowerCase();

        return this.allInsurance
            .filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
            .map(v => {
                return v;
            });
    }

    /*
    * init filter
    * **/
    private filterInsurance(): any {
        for (const formG of this.insurance.controls) {

            this.filteredOptions = formG.get('insurance').valueChanges.pipe(
                map(value => this._filter(value))
            );
        }

        console.log(this.filteredOptions);
    }

    /**
     * validator like to listen to changes of the value
     * */
    shouldEnableInsuranceNumber(control: AbstractControl): any {
        //
        // if (control.value !== '') {
        //     this.patientsForm.controls['insuranceNO'].enable({onlySelf: true});
        //
        // } else {
        //     this.patientsForm.controls['insuranceNO'].patchValue('');
        //     this.patientsForm.controls['insuranceNO'].disable();
        // }

        // not interest in the errors.
        return null;
    }


    submitPatientsForm(): void {
        console.log(this.patientsForm);
        if (this.patientsForm.valid) {

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

        const insurancenumber = new FormControl('');

        return this.formBuilder.group({
            insurance: insurancex,
            insurancenumber: insurancenumber
        });
    }

    addInsurance(): void {
        this.insurance.push(this.createInsurance());
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
                this.notificationservice.notify({
                    alert_type: 'error',
                    body: 'File number has been used',
                    title: 'ERROR',
                    placement: 'center'
                });
            }
        });

    }

}