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
import {NotificationService} from '../../../shared/services/notifications.service';
import {FuseConfirmDialogComponent} from '../../../../@fuse/components/confirm-dialog/confirm-dialog.component';

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
    multipayment = false;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


    constructor(private queue: QueueService,
                private hospital: HospitalService,
                private visitservice: PatientvisitService,
                private paymentmethodService: PaymentmethodService,
                private hospitalservice: HospitalService,
                public _matDialog: MatDialog,
                private procedureservice: ProceduresService,
                private notifications: NotificationService,
                public thisdialogRef: MatDialogRef<InvoiceCustomizationComponent>,
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
                    console.log(value.queuedata.procedures);
                    if (!value.queuedata.payment.hasinsurance) {
                        value.queuedata.procedures = value.queuedata.procedures.map(value1 => {
                            value1.payment.amount = this.getpaymentamount(value1.customprocedureid);
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


    getpaymentamount(customprocedureid: string, insuranceid ?: string): number {
        if (insuranceid) {
            /**
             * check if the procedure contains a custom price for insurance
             */
            if (!!this.procedureservice.hospitalprocedures.value.find(value => {
                return value.customprocedure.id === customprocedureid && value.customprocedure.custominsuranceprice && !!value.customprocedure.insuranceprices[insuranceid];
            })) {
                return this.procedureservice.hospitalprocedures.value.find(value => {
                    return value.customprocedure.id === customprocedureid && !!value.customprocedure.insuranceprices[insuranceid];
                }).customprocedure.insuranceprices[insuranceid];

            } else {
                /**
                 * return the normal price
                 */
                return this.procedureservice.hospitalprocedures.value.find(value => {
                    return value.customprocedure.id === customprocedureid;
                }).customprocedure.regularprice;
            }
        } else {
            /**
             * return the normal price
             */
            return this.procedureservice.hospitalprocedures.value.find(value => {
                return value.customprocedure.id === customprocedureid;
            }).customprocedure.regularprice;
        }
    }

    preview(): void {
        this.dialogRef = this._matDialog.open(InvoiceComponent, {
            data: this.patientid
        });

        this.dialogRef.afterClosed();
    }

    selectprocedure(procedure): void {
        if (this.patientdata.queuedata.payment.splitpayment) {
            this.clickedprocedure = procedure;
        }
    }

    togglechange(): void {

        setTimeout(() => {
            this.notifications.notify({
                placement: 'centre',
                title: 'Info',
                alert_type: 'info',
                body: 'Coming soon...'
            });
            this.patientdata.queuedata.payment.splitpayment = false;
        }, 800);

    }

    setchannel(channel: PaymentChannel): void {
        this.patientdata.queuedata.payment.singlepayment = {
            amount: 0,
            channelid: channel.id,
            methidid: '',
            transactionid: ''
        };
        const isinsurance = channel.name === 'insurance';
        if (!isinsurance) {
            this.patientdata.queuedata.payment.hasinsurance = null;
        }
        let total = 0;
        this.patientdata.queuedata.procedures.map(value => {
            const amount = this.getpaymentamount(value.customprocedureid);
            value.payment = {
                amount: amount,
                methods: [{
                    amount: amount,
                    channelid: channel.id,
                    methidid: '',
                    transactionid: ''
                }],
                hasinsurance: isinsurance
            };
            total += amount;
        });
        this.patientdata.queuedata.payment.total = total;
    }

    getcativechannelmethods(channelid: string): Array<CustomPaymentMethod> {
        return this.hospitalmethods.filter(value => {
            return value.paymentchannelid === channelid;
        });
    }

    getmethodname(channelid: string, methodid: string): string {
        return this.allpaymentchannels.find(value => {
            return value.id === channelid;
        }).methods[methodid].name;
    }

    insurancename(insuranceid: string): string {
        return this.allpaymentchannels.find(value => {
            return value.name === 'insurance';
        }).methods[insuranceid].name;
    }


    selectinsurance(insurance): void {
        this.patientdata.queuedata.payment.hasinsurance = true;
        let total = 0;
        this.patientdata.queuedata.procedures.map(value => {
            const amount = this.getpaymentamount(value.customprocedureid, insurance.id);
            value.payment = {
                amount: amount,
                methods: [{
                    amount: amount,
                    channelid: '',
                    methidid: insurance.id,
                    transactionid: ''
                }],
                hasinsurance: true
            };
            total += amount;
        });
        this.patientdata.queuedata.payment.total = total;
        this.patientdata.queuedata.payment.singlepayment.amount = total;
    }


    channelconfigured(channelid: string): boolean {
        return !!this.hospitalmethods.filter(value => {
            return value.paymentchannelid === channelid;
        });
    }

    togglemultipayment(): void {

        setTimeout(() => {
            this.notifications.notify({
                placement: 'centre',
                title: 'Info',
                alert_type: 'info',
                body: 'Coming soon...'
            });
            this.multipayment = false;
        }, 800);

    }

    pay(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to pay for the Invoice and exit the patient??';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.visitservice.payandexit(this.patientdata.queuedata);
                this.thisdialogRef.close();
            }
        });
    }

    ngOnInit(): void {
    }

}
