import {Component, OnInit} from '@angular/core';
import {PatientvisitService} from '../../../../services/patientvisit.service';
import {PatientVisit} from '../../../../../models/PatientVisit';

@Component({
    selector: 'patient-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    patientvisits: Array<PatientVisit>;

    constructor(private patientvisitService: PatientvisitService) {
        patientvisitService.patientvisits.subscribe(visits => {
            this.patientvisits = visits;
        });
    }

    ngOnInit(): void {
    }

}
