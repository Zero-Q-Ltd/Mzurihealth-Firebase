import {Component, Inject, OnInit} from '@angular/core';
import {QueueService} from '../../services/queue.service';
import {PatientvisitService} from '../../services/patientvisit.service';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {emptyproceduresperformed, Proceduresperformed} from '../../../models/Procedureperformed';
import {BehaviorSubject} from 'rxjs';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel} from '../../../models/PaymentChannel';
import {HospitalService} from '../../services/hospital.service';
import {CustomPaymentMethod} from '../../../models/CustomPaymentMethod.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {InvoiceComponent} from '../invoice/invoice.component';

@Component({
    selector: 'app-invoice-payment',
    templateUrl: './invoice-customization.component.html',
    styleUrls: ['./invoice-customization.component.scss']
})
export class InvoiceCustomizationComponent implements OnInit {
    patientdata: BehaviorSubject<MergedPatient_QueueModel> = new BehaviorSubject<MergedPatient_QueueModel>({...emptymergedQueueModel});
    proceduredata: Proceduresperformed = emptyproceduresperformed;
    allpaymentchannels: Array<PaymentChannel> = [];
    hospitalmethods: Array<CustomPaymentMethod> = [];
    imeanzilisha = false;
    dialogRef: MatDialogRef<any>;
    clickedprocedure

    constructor(private queue: QueueService,
                private hospital: HospitalService,
                private visitservice: PatientvisitService,
                private paymentmethodService: PaymentmethodService,
                public _matDialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public patientid: string) {
        /**
         * Subscribe so that other admin changes are immediately reflected
         */
        queue.mainpatientqueue.subscribe(queuedata => {
            queuedata.filter(value => {
                if (value.patientdata.id === this.patientid) {
                    this.patientdata.next(value);
                }
            });
        });

        /**
         * Avoid making unneccessary subscriptions
         */
        this.patientdata.subscribe(data => {
            if (data.patientdata.id) {
                if (data.queuedata.id !== this.proceduredata.id) {
                    this.imeanzilisha = false;
                    this.visitservice.fetchvisitprocedures(data.queuedata.id).onSnapshot(snapshot => {
                        const procedures: Proceduresperformed = Object.assign({}, {...emptyproceduresperformed}, snapshot.data());
                        procedures.id = snapshot.id;
                        this.proceduredata = procedures;
                        this.imeanzilisha = true;
                    });
                }
            }
        });
        this.paymentmethodService.allpaymentchannels.subscribe(channels => {
            this.allpaymentchannels = channels;
        });
        this.hospital.activehospital.subscribe(hosp => {
            this.hospitalmethods = hosp.paymentmethods;
        });
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
