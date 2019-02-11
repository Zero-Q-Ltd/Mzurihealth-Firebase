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
    allInsurance: { [key: string]: Paymentmethods } = {};
    patient: Patient;
    dialogTitle: string;
    paymentMethods: Array<PaymentChannel>;
    insurance: FormArray;

    selected: number;
    selectedInsurance: { insuranceControl: string, insurancenumber: string } = null;

    insuranceSet: boolean;
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

        this.createQueueForm();
        /**
         * listen for insurance selection.
         * */
        this.listenForInsurance();

        /*
        * listen for insurance ArrayForm
        * **/
        this.listenForInsuranceArrayChanges();
    }

    ngOnInit(): void {
    }

    createQueueForm(): void {
        this.queueForm = this._formBuilder.group({
            description: ['', Validators.required],
            type: ['', Validators.required],
            insurance: this._formBuilder.array([])
        });

        this.insurance = this.queueForm.get('insurance') as FormArray;
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
                    pData.insurance.map((insuranceData: { id: string, insuranceno: string }, index) => {
                        this.insuranceAvailable = true;
                        this.addInsurance();

                        const mergedData = Object.assign({}, this.allInsurance[insuranceData.id],
                            {id: insuranceData.id, insuranceno: insuranceData.insuranceno});

                        this.insurance.controls[index].get('insuranceControl').patchValue(mergedData.id, {emitEvent: false});
                        this.insurance.controls[index].get('insurancenumber').patchValue(mergedData.insuranceno, {emitEvent: false});

                        /*
                        * disable inputs
                        * **/
                        this.insurance.controls[index].get('insuranceControl').disable({emitEvent: false});
                        this.insurance.controls[index].get('insurancenumber').disable({emitEvent: false});
                    });
                });

            } else {
                // clear formArray values
                this.insurance.controls = [];
                this.selected = null;
                this.selectedInsurance = null;


                this.insuranceSet = false;
                this.insuranceAvailable = false;
            }
        });
    }


    private createInsurance(): FormGroup {
        return this._formBuilder.group({
            insuranceControl: new FormControl('', Validators.required),
            insurancenumber: new FormControl('', Validators.required)
        });
    }

    private createPayment(): FormGroup {
        return this._formBuilder.group({
            typeCtr: ['', Validators.required],
            insurancenumber: ['', Validators.required]
        });
    }

    private insuranceEnabled(): boolean {
        if (this.insuranceSet) {
            return this.insuranceAvailable;
        } else {
            return true;
        }
    }

    removeInsurance(index: number): void {
        this.insurance.removeAt(index);
        if (index === this.selected) {
            this.selected = null;
            this.selectedInsurance = null;
        }
    }

    addInsurance(): void {
        this.insurance.push(this.createInsurance());
    }

    submitForm(): void {
        if (this.insuranceEnabled()) {
            if (this.insuranceSet && this.selected === null) {
                this.notificationService.notify({
                    alert_type: 'error',
                    body: 'The please select Insurance',
                    title: 'ERROR',
                    placement: {horizontal: 'right', vertical: 'top'}
                });
                return;
            }
            this.matDialogRef.close(['save', {data: this.queueForm, selected: this.selectedInsurance}]);
        } else {
            this.notificationService.notify({
                alert_type: 'error',
                body: 'The user does not have any insurance',
                title: 'ERROR',
                placement: {horizontal: 'right', vertical: 'top'}
            });
        }
    }

    /**
     * function to listen to form controls changes
     * */
    listenForInsuranceArrayChanges(): void {
        // make checkList select one value only
        if (this.insurance.length !== 0) {
            this.insuranceSet = true;
            this.insuranceAvailable = true;
        } else {
            this.insuranceSet = false;
            this.insuranceAvailable = false;
        }

    }

    setSelectedInsurance(checked, selectedInsurance: FormGroup, index): void {
        if (!checked && index === this.selected) {
            this.selected = null;
            this.selectedInsurance = null;
            console.log('item unselected');
            return;
        }
        this.selected = index;
        this.selectedInsurance = selectedInsurance.getRawValue();
    }
}
