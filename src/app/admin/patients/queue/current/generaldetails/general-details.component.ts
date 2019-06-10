import {Component, Inject, OnInit, Optional} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {Patient} from '../../../../../models/patient/Patient';
import * as moment from 'moment';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../../../services/admin.service';
import {PatientService} from '../../../../services/patient.service';
import {NotificationService} from '../../../../../shared/services/notifications.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {QueueService} from '../../../../services/queue.service';
import {Paymentmethods} from '../../../../../models/payment/PaymentChannel';
import {PaymentmethodService} from '../../../../services/paymentmethod.service';

@Component({
    selector: 'general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.scss'],
    animations: fuseAnimations

})
export class GeneralDetailsComponent implements OnInit {
    allInsurance: { [key: string]: Paymentmethods } = {};
    patientsForm: FormGroup;
    currentpatient: Patient;
    // private medicalinfo: FormGroup;
    loading = true;
    private personalinfo: FormGroup;
    private nextofkin: FormGroup;
    // doctor will do this
    private insurance: FormArray;

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private formBuilder: FormBuilder,
                private notificationservice: NotificationService,
                private paymentethods: PaymentmethodService,
                private queue: QueueService,
                @Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {

        this.paymentethods.allinsurance.subscribe(insurance => {
            this.allInsurance = insurance;
            if (!insurance['0']) {
                return;
            }
            /**
             * make sure insurances are already initialized to avoid crazy form errors
             */
            this.queue.currentpatient.subscribe(value => {
                /**
                 * check if this is an empty patient before
                 */
                if (!value.patientdata._id) {
                    return;
                }
                this.initFormBuilder();
                this.loading = false;

                this.currentpatient = value.patientdata;
                this.patientsForm.controls['personalinfo']
                    .get('fileno').patchValue(value.patientdata.fileinfo.no);

                this.patientsForm.controls['personalinfo']
                    .get('fileno').disable({onlySelf: true});

                this.patientsForm.controls['personalinfo']
                    .get('firstname').patchValue(value.patientdata.personalinfo.name.split(' ')[0]);

                this.patientsForm.controls['personalinfo']
                    .get('lastname').patchValue(value.patientdata.personalinfo.name.split(' ')[1]);

                this.patientsForm.controls['personalinfo']
                    .get('idno').patchValue(value.patientdata.personalinfo.idno);

                this.patientsForm.controls['personalinfo']
                    .get('gender').patchValue(value.patientdata.personalinfo.gender);

                this.patientsForm.controls['personalinfo']
                    .get('birth').patchValue(value.patientdata.personalinfo.dob);

                this.patientsForm.controls['personalinfo']
                    .get('email').patchValue(value.patientdata.personalinfo.email);

                this.patientsForm.controls['personalinfo']
                    .get('workplace').patchValue(value.patientdata.personalinfo.workplace);

                this.patientsForm.controls['personalinfo']
                    .get('phone').patchValue(value.patientdata.personalinfo.phone);

                this.patientsForm.controls['personalinfo']
                    .get('address').patchValue(value.patientdata.personalinfo.address);

                this.patientsForm.controls['personalinfo']
                    .get('occupation').patchValue(value.patientdata.personalinfo.occupation);

                this.patientsForm.controls['nextofkin']
                    .get('relationship').patchValue(value.patientdata.nextofkin.relationship);

                this.patientsForm.controls['nextofkin']
                    .get('name').patchValue(value.patientdata.nextofkin.name);

                this.patientsForm.controls['nextofkin']
                    .get('phone').patchValue(value.patientdata.nextofkin.phone);

                this.patientsForm.controls['nextofkin']
                    .get('workplace').patchValue(value.patientdata.nextofkin.workplace);


                value.patientdata.insurance.forEach(i => {
                    this.insurance.push(this.replicateInsurance(i));
                    this.insurancechanges();
                });

            });
        });


    }

    getTime(): any {
        return moment().format('LLL');
    }

    ngOnInit(): void {
    }

    getage(dob): number {
        return moment().diff(dob, 'years');
    }

    submitPatientsForm(): void {
        if (this.patientsForm.valid) {
            this.patientservice.updatePatient(this.currentpatient._id, this.patientsForm.getRawValue()).then(() => {
                this.notificationservice.notify({
                    alert_type: 'success',
                    body: 'Patient successifully updated',
                    title: 'Success',
                    placement: {
                        horizontal: 'right',
                        vertical: 'top'
                    }
                });
            });
        } else {
            this.notificationservice.notify({
                alert_type: 'error',
                body: 'Please fill all the required inputs',
                title: 'ERROR',
                placement: {
                    horizontal: 'center',
                    vertical: 'bottom'
                }
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

    replicateInsurance(insurancedata: { id: string; insuranceno: string; }): FormGroup {
        const insurancex = new FormControl({
            value: insurancedata.id,
            disabled: false
        });
        const insurancenumber = new FormControl({
            value: insurancedata.insuranceno,
            disabled: false
        });
        return this.formBuilder.group({
            id: insurancex,
            insurancenumber: insurancenumber
        });
    }

    insurancechanges(): void {
        this.insurance.controls.forEach(x => {
            x.get('_id').valueChanges.subscribe(g => {
                if (g) {
                    if (x.get('_id').value.toString().length > -1) {
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
            insurance: this.formBuilder.array([]),
            nextofkin: this.nextofkin,
            personalinfo: this.personalinfo
        });


        /*
        * init the insurance list
        * **/
        this.insurance = this.patientsForm.get('insurance') as FormArray;
    }

}
