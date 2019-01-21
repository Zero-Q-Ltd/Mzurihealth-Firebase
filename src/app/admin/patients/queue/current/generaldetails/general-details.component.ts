import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';

@Component({
    selector: 'general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.scss'],
    animations: fuseAnimations

})
export class GeneralDetailsComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
