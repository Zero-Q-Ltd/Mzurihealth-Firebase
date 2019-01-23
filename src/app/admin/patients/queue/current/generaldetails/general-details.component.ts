import {Component, Input, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {emptypatient, Patient} from '../../../../../models/Patient';
import * as moment from 'moment';

@Component({
    selector: 'general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.scss'],
    animations: fuseAnimations

})
export class GeneralDetailsComponent implements OnInit {
    @Input() patient: Patient = {...emptypatient};

    constructor() {

    }

    ngOnInit(): void {
    }

    getage(dob): number {
        return moment().diff(dob, 'years');
    }
}
