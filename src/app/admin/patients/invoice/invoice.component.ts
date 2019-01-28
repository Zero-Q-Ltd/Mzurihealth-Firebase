import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {HospitalService} from '../../services/hospital.service';
import {Hospital} from '../../../models/Hospital';
import {Procedureperformed} from '../../../models/Procedureperformed';
import {emptypatientvisit, PatientVisit} from '../../../models/PatientVisit';
import {emptypatient, Patient} from '../../../models/Patient';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
    visit: { visitinfo: PatientVisit, procedures: Array<Procedureperformed>, patientinfo: Patient } = {
        procedures: [],
        visitinfo: {...emptypatientvisit},
        patientinfo: {...emptypatient}
    };

    // Private
    private _unsubscribeAll: Subject<any>;
    activehospital: Hospital;


    /**
     * Constructor
     *
     * @param {InvoiceService} _invoiceService
     */
    constructor(private hospitalservice: HospitalService) {
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
