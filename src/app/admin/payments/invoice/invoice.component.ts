import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {PaymentChannel} from '../../../models/PaymentChannel';
import {Subject} from 'rxjs';
import {Hospital} from '../../../models/Hospital';
import {HospitalService} from '../../services/hospital.service';
import {QueueService} from '../../services/queue.service';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PatientvisitService} from '../../services/patientvisit.service';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
    allpaymentchannels: Array<PaymentChannel> = [];
    private _unsubscribeAll: Subject<any>;
    activehospital: Hospital;
    hidden = false;

    constructor(private hospitalservice: HospitalService,
                private queue: QueueService,
                private paymentmethodService: PaymentmethodService,
                private patientvisit: PatientvisitService,
                @Inject(MAT_DIALOG_DATA) public patientdata: MergedPatient_QueueModel) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.hospitalservice.activehospital.subscribe(hosp => {
            this.activehospital = hosp;
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


    showPrint(): void {
        this.hidden = true;
        setTimeout(() => {
            window.print();

            setTimeout(() => {
                this.hidden = false;
            }, 2000);
        }, 200);

    }
}
