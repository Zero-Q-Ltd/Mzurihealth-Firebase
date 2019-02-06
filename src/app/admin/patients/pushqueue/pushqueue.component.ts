import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Patient} from '../../../models/Patient';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel, Paymentmethods} from '../../../models/PaymentChannel';
import {PatientService} from '../../services/patient.service';
import {NotificationService} from '../../../shared/services/notifications.service';

@Component({
    selector: 'app-pushqueue',
    templateUrl: './pushqueue.component.html',
    styleUrls: ['./pushqueue.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PushqueueComponent implements OnInit {

    queueForm: FormGroup;
    patient: Patient;
    dialogTitle: string;
    paymentMethods: Array<PaymentChannel>;
    allInsurance: any;
    insurance: FormArray;

    private insuranceSet: boolean;
    private insuranceAvailable: boolean;

    constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) private _data: any,
                public matDialogRef: MatDialogRef<PushqueueComponent>, private notificationService: NotificationService,
                private paymentmethodService: PaymentmethodService, private patientService: PatientService) {

        this.insuranceAvailable = false;
        this.insuranceSet = false;

        this.patient = _data.patient;
        this.dialogTitle = 'Queue Patient';
        this.paymentmethodService.allpaymentchannels.subscribe(payments => {
            this.paymentMethods = payments;
        });

        this.paymentmethodService.allinsurance.subscribe(insurance => {
            this.allInsurance = insurance;
        });

        this.queueForm = this.createQueueForm();
        /**
         * listen for insurance selection.
         * */
        this.listenForInsurance();
    }

    ngOnInit(): void {
    }

    createQueueForm(): FormGroup {
        return this._formBuilder.group({
            description: ['', Validators.required],
            type: ['', Validators.required],
            insurance: this._formBuilder.array([this.createInsurance()])
        });
    }

    private listenForInsurance(): void {
        this.queueForm.get('type').valueChanges.subscribe((value: PaymentChannel) => {
            if (value.name === 'insurance') {
                this.insuranceSet = true;

                // this.patientService.
                this.patientService.getSinglePatient(this.patient.id).subscribe(pData => {

                    if (pData.insurance.length === 0) {
                        this.insuranceAvailable = false;
                    }
                    pData.insurance.map((insurance: { id: string, insuranceno: string }) => {
                        // this.insuranceAvailable = true;
                        this.insuranceAvailable = false;
                    });
                });

            } else {
                console.log('No insurance');
                this.insuranceSet = false;
                this.insuranceAvailable = false;
            }
        });
    }


    private createInsurance(): FormGroup {
        return this._formBuilder.group({
            insuranceControl: new FormControl('', Validators.required)
        });
    }

    private createPayment(): FormGroup {
        return this._formBuilder.group({
            typeCtr: ['', Validators.required]
        });
    }

    private insuranceEnabled(): boolean {
        if (this.insuranceSet) {
            return this.insuranceAvailable;
        } else {
            return true;
        }
    }

    submitForm(): void {
        if (this.insuranceEnabled()) {
            this.matDialogRef.close(['save', this.queueForm]);
        } else {
            this.notificationService.notify({
                alert_type: 'error',
                body: 'The user does not have any insurance',
                title: 'ERROR',
                placement: {horizontal: 'right', vertical: 'top'}
            });
        }
    }
}
