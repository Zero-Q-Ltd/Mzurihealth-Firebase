import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';

@Component({
    selector: 'patient-currrent',
    templateUrl: './currrent.component.html',
    styleUrls: ['./currrent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CurrrentComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
