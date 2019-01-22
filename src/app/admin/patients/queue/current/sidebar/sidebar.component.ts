import {Component, OnInit} from '@angular/core';
import {LocalcommunicationService} from '../localcommunication.service';
import {emptypatient, Patient} from '../../../../../models/Patient';

@Component({
    selector: 'current-patients-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    patient: Patient = {...emptypatient};
    activepage: string = 'generaldetails';

    constructor(private communication: LocalcommunicationService) {
        communication.selectedpatient.subscribe(patient => {
            this.patient = patient;
        });
        communication.onactivechildpagechanged.subscribe(page => {
            this.activepage = page;
        });
    }

    changeactivepage(page: string): void {
        this.communication.onactivechildpagechanged.next(page);
    }

    ngOnInit(): void {
    }

}
