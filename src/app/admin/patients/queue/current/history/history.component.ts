import {Component, OnInit} from '@angular/core';
import {PatientvisitService} from '../../../../services/patientvisit.service';
import {PatientVisit} from '../../../../../models/PatientVisit';
import {HospitalAdmin} from '../../../../../models/HospitalAdmin';
import {HospitalService} from '../../../../services/hospital.service';

@Component({
    selector: 'patient-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    patientvisits: Array<PatientVisit>;
    hospitaladmins: Array<HospitalAdmin>;

    constructor(private patientvisitService: PatientvisitService,
                private  hospitalservice: HospitalService,) {
        patientvisitService.visithistory.subscribe(visits => {
            this.patientvisits = visits;
        });
        hospitalservice.hospitaladmins.subscribe(admins => {
            this.hospitaladmins = admins;
        });
    }

    ngOnInit(): void {
    }

}
