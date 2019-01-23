import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {emptypatient, Patient} from '../../../../../models/Patient';
import {LocalcommunicationService} from '../localcommunication.service';
import * as moment from 'moment';

@Component({
    selector: 'general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.scss'],
    animations: fuseAnimations

})
export class GeneralDetailsComponent implements OnInit {
    patient: Patient = {...emptypatient};

    constructor(private communication: LocalcommunicationService) {
        communication.selectedpatient.subscribe(patient => {
            this.patient = patient;
        });
    }

    ngOnInit(): void {
    }

    getage(dob): number {
        return moment().diff(dob, 'years');
    }
}
