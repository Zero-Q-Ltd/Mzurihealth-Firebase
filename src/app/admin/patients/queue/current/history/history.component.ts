import {Component, OnInit} from '@angular/core';
import {PatienthistoryService} from '../../../../services/patienthistory.service';

@Component({
    selector: 'patient-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    constructor(private patienthistory: PatienthistoryService) {
    }

    ngOnInit() {
    }

}
