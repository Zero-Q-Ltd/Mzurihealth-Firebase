import {Component, Inject, OnInit, Optional} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {Patient} from '../../../../../models/Patient';
import * as moment from 'moment';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InsuranceCompany} from '../../../../../models/InsuranceCompany';
import {AdminService} from '../../../../services/admin.service';
import {PatientService} from '../../../../services/patient.service';
import {InsuranceService} from '../../../../services/insurance.service';
import {NotificationService} from '../../../../../shared/services/notifications.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {QueueService} from '../../../../services/queue.service';

@Component({
    selector: 'general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.scss'],
    animations: fuseAnimations

})
export class GeneralDetailsComponent implements OnInit {
    allInsurance: InsuranceCompany[];
    patientsForm: FormGroup;
    currentpatient: Patient;
    private personalinfo: FormGroup;
    private nextofkin: FormGroup;
    private insurance: FormArray;
    // doctor will do this
    // private medicalinfo: FormGroup;

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private formBuilder: FormBuilder,
                private insuranceservice: InsuranceService,
                private notificationservice: NotificationService,
                private queue: QueueService,
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
        this.queue.currentpatient.subscribe(value => {
            this.currentpatient = value.patientdata;
            this.patientsForm.controls['personalinfo']
                .get('fileno').patchValue(value.patientdata.fileinfo.no);

            this.patientsForm.controls['personalinfo']
                .get('fileno').disable({onlySelf: true});

            this.patientsForm.controls['personalinfo']
                .get('firstname').patchValue(value.patientdata.personalinfo.name);
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

    getage(dob): number {
        return moment().diff(dob, 'years');
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
            this.patientservice.updatePatient(this.currentpatient.id, this.patientsForm.getRawValue()).then(() => {
                console.log('patient added successfully');
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

}
