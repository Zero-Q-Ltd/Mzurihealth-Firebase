import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Patient} from '../../../models/Patient';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel, Paymentmethods} from '../../../models/PaymentChannel';
import {PatientService} from '../../services/patient.service';

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
    private insurance: FormArray;
    private payments: FormArray;


    constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) private _data: any,
                public matDialogRef: MatDialogRef<PushqueueComponent>,
                private paymentmethodService: PaymentmethodService, private patientService: PatientService) {

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
        // this.listenForInsurance();
    }

    ngOnInit(): void {
    }

    createQueueForm(): FormGroup {
        return this._formBuilder.group({
            description: ['', Validators.required],
            type: ['', Validators.required]
        });
    }

    // private listenForInsurance(): void {
    //     this.queueForm.get('type').valueChanges.subscribe(value => {
    //         if (value === 'G3IouO1Z93KA52mJBqnW') {
    //             // this.patientService.
    //             this.patientService.getSinglePatient(this.patient.id).subscribe(pData => {
    //                 pData.insurance.map((insurance: { id: string, insuranceno: string }) => {
    //
    //                     const data = Object.assign({}, insurance, {name: this.allInsurance[insurance.id].name});
    //                 });
    //             });
    //
    //         }
    //     });
    // }


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

}
