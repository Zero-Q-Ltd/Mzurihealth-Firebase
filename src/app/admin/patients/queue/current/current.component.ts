import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {LocalcommunicationService} from './localcommunication.service';
import {Patient} from '../../../../models/Patient';

@Component({
    selector: 'patient-current',
    templateUrl: './current.component.html',
    styleUrls: ['./current.component.scss'],
    animations: fuseAnimations
})
export class CurrentComponent implements OnInit {
    activepage: string = 'generaldetails';
    patient: Patient;

    constructor(private communication: LocalcommunicationService) {
        communication.onactivechildpagechanged.subscribe(page => {
            this.activepage = page;
        });
        communication.selectedpatient.subscribe(patient => {
            this.patient = patient;
        });
    }

    ngOnInit() {
    }

}
