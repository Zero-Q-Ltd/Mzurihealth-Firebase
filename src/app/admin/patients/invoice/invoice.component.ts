import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {HospitalService} from '../../services/hospital.service';
import {Hospital} from '../../../models/Hospital';
import {PatientvisitService} from '../../services/patientvisit.service';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {QueueService} from '../../services/queue.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel} from '../../../models/PaymentChannel';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
    patientdata: MergedPatient_QueueModel = {...emptymergedQueueModel};
    allpaymentchannels: Array<PaymentChannel> = [];
    private _unsubscribeAll: Subject<any>;
    activehospital: Hospital;

    constructor(private hospitalservice: HospitalService,
                private queue: QueueService,
                private paymentmethodService: PaymentmethodService,
                private patientvisit: PatientvisitService,
                @Inject(MAT_DIALOG_DATA) public patientid: string) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.hospitalservice.activehospital.subscribe(hosp => {
            this.activehospital = hosp;
        });
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
        this.paymentmethodService.allpaymentchannels.subscribe(channels => {
            this.allpaymentchannels = channels;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }
    getmethodname(channelid: string, methodid: string): string {
        return this.allpaymentchannels.find(value => {
            return value.id === channelid;
        }).methods[methodid].name;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    print(): void {
        window.print();
    }
}
