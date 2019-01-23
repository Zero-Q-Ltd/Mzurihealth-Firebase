import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {LocalcommunicationService} from './localcommunication.service';
import {Patient} from '../../../../models/Patient';
import {PatientService} from '../../../services/patient.service';

@Component({
    selector: 'patient-current',
    templateUrl: './current.component.html',
    styleUrls: ['./current.component.scss'],
    animations: fuseAnimations
})
export class CurrentComponent implements OnInit {
    activepage = 'generaldetails';
    patient: Patient;

    constructor(private communication: LocalcommunicationService, private patientservice: PatientService) {
        communication.onactivechildpagechanged.subscribe(page => {
            this.activepage = page;
        });
        communication.selectedpatient.subscribe(patient => {
            /**
             * TODO : Collaborate with @Johnie
             */
            this.patientservice.getcurrentpatient(patient.id);
            this.patient = patient;
        });
    }

    ngOnInit(): void {
    }

}
