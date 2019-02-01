import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {HospitalService} from '../../services/hospital.service';
import {Hospital} from '../../../models/Hospital';
import {Proceduresperformed} from '../../../models/Procedureperformed';
import {PatientvisitService} from '../../services/patientvisit.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
    performedprocedures: Proceduresperformed;

    private _unsubscribeAll: Subject<any>;
    activehospital: Hospital;

    constructor(private hospitalservice: HospitalService,
                private patientvisit: PatientvisitService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.hospitalservice.activehospital.subscribe(hosp => {
            this.activehospital = hosp;
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
