import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {QueueService} from '../../services/queue.service';
import {PatientvisitService} from '../../services/patientvisit.service';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {emptyprocedureperformed, Procedureperformed} from '../../../models/Procedureperformed';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel} from '../../../models/PaymentChannel';
import {HospitalService} from '../../services/hospital.service';
import {CustomPaymentMethod} from '../../../models/CustomPaymentMethod.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {InvoiceComponent} from '../invoice/invoice.component';
import {HospitalAdmin} from '../../../models/HospitalAdmin';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ProceduresService} from '../../services/procedures.service';

@Component({
    selector: 'app-invoice-payment',
    templateUrl: './invoice-customization.component.html',
    styleUrls: ['./invoice-customization.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InvoiceCustomizationComponent implements OnInit {
    patientdata: MergedPatient_QueueModel = {...emptymergedQueueModel};
    allpaymentchannels: Array<PaymentChannel> = [];
    hospitalmethods: Array<CustomPaymentMethod> = [];
    dialogRef: MatDialogRef<any>;
    clickedprocedure: Procedureperformed = {...emptyprocedureperformed};
    hospitaladmins: Array<HospitalAdmin> = [];
    proceduresdatasouce: MatTableDataSource<Procedureperformed> = new MatTableDataSource<Procedureperformed>();

    procedureheaders = ['name', 'admin-time', 'payment-method', 'cost'];
    paymentmethodheaders = ['channel', 'amount', 'transactionid'];

    constructor(private queue: QueueService,
                private hospital: HospitalService,
                private visitservice: PatientvisitService,
                private paymentmethodService: PaymentmethodService,
                private hospitalservice: HospitalService,
                public _matDialog: MatDialog,
                private procedureservice: ProceduresService,
                @Inject(MAT_DIALOG_DATA) public patientid: string) {
        /**
         * Subscribe so that other admin changes are immediately reflected
         */
        queue.mainpatientqueue.subscribe(queuedata => {
            queuedata.filter(value => {
                if (value.patientdata.id === this.patientid) {
                    /**
                     * Initialize the prices
                     */
                    if (!value.queuedata.payment.hasinsurance) {
                        value.queuedata.procedures = value.queuedata.procedures.map(value1 => {
                            value1.payment.amount = this.getpaymentamount(value1.procedureid);
                            return value1;
                        });
                    }
                    this.patientdata = value;
                    this.proceduresdatasouce.data = value.queuedata.procedures;
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


    getpaymentamount(procedureid: string, insuranceid ?: string): number {
        if (insuranceid) {
            /**
             * check if the procedure contains a custom price for insurance
             */
            if (this.procedureservice.hospitalprocedures.value.find(value => {
                return value.customprocedure.id === procedureid && value.customprocedure.custominsuranceprice;
            })) {
                return this.procedureservice.hospitalprocedures.value.find(value => {
                    return value.customprocedure.id === procedureid && Object.keys(value.customprocedure.insuranceprices[insuranceid]).length > 0;
                }).customprocedure.insuranceprices[insuranceid].price;

            } else {
                /**
                 * return the normal price
                 */
                return this.procedureservice.hospitalprocedures.value.find(value => {
                    return value.customprocedure.id === procedureid;
                }).customprocedure.regularprice;
            }
        } else {
            /**
             * return the normal price
             */
            return this.procedureservice.hospitalprocedures.value.find(value => {
                return value.customprocedure.id === procedureid;
            }).customprocedure.regularprice;
        }
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
