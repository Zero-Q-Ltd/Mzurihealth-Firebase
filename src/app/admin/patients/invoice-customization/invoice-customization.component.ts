import {Component, Inject, OnInit} from '@angular/core';
import {QueueService} from '../../services/queue.service';
import {PatientvisitService} from '../../services/patientvisit.service';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {emptyprocedureperformed, Procedureperformed} from '../../../models/Procedureperformed';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel} from '../../../models/PaymentChannel';
import {HospitalService} from '../../services/hospital.service';
import {CustomPaymentMethod} from '../../../models/CustomPaymentMethod.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {InvoiceComponent} from '../invoice/invoice.component';
import {HospitalAdmin} from '../../../models/HospitalAdmin';

@Component({
    selector: 'app-invoice-payment',
    templateUrl: './invoice-customization.component.html',
    styleUrls: ['./invoice-customization.component.scss']
})
export class InvoiceCustomizationComponent implements OnInit {
    patientdata: MergedPatient_QueueModel = {...emptymergedQueueModel};
    allpaymentchannels: Array<PaymentChannel> = [];
    hospitalmethods: Array<CustomPaymentMethod> = [];
    imeanzilisha = false;
    dialogRef: MatDialogRef<any>;
    clickedprocedure: Procedureperformed = {...emptyprocedureperformed};
    hospitaladmins: Array<HospitalAdmin> = [];


    constructor(private queue: QueueService,
                private hospital: HospitalService,
                private visitservice: PatientvisitService,
                private paymentmethodService: PaymentmethodService,
                private hospitalservice: HospitalService,
                public _matDialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public patientid: string) {
        /**
         * Subscribe so that other admin changes are immediately reflected
         */
        queue.mainpatientqueue.subscribe(queuedata => {
            queuedata.filter(value => {
                if (value.patientdata.id === this.patientid) {
                    this.patientdata = value;
                }
            });
        });

        hospitalservice.hospitaladmins.subscribe(admins => {
            this.hospitaladmins = admins;
        });

        this.paymentmethodService.allpaymentchannels.subscribe(channels => {
            this.allpaymentchannels = channels;
        });
        this.hospital.activehospital.subscribe(hosp => {
            this.hospitalmethods = hosp.paymentmethods;
        });
    }

    selectprocedure(procedure: Procedureperformed): void {
        this.clickedprocedure = procedure;
    }

    preview(): void {
        this.dialogRef = this._matDialog.open(InvoiceComponent, {
            data: {
                patient: 'data',
                action: 'save'
            }
        });

        this.dialogRef.afterClosed();
    }

    pay(): void {

    }

    ngOnInit(): void {
    }

}
