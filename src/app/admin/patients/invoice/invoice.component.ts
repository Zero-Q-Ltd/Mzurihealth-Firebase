import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {HospitalService} from '../../services/hospital.service';
import {Hospital} from '../../../models/Hospital';
import {QueueService} from '../../services/queue.service';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {Procedureperformed} from '../../../models/Procedureperformed';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
    visit: { procedures: Array<Procedureperformed>, patientinfo: MergedPatient_QueueModel } = {
        procedures: [],
        patientinfo: {...emptymergedQueueModel}
    };

    // Private
    private _unsubscribeAll: Subject<any>;
    activehospital: Hospital;

    constructor(private hospitalservice: HospitalService, private queue: QueueService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.hospitalservice.activehospital.subscribe(hosp => {
            this.activehospital = hosp;
        });
        this.queue.currentvisitprocedures.subscribe(procedures => {
            this.visit.procedures = procedures;
        });
        this.queue.currentpatient.subscribe(patient => {
            this.visit.patientinfo = patient;
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
