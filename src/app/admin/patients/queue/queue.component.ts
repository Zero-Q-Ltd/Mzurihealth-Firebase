import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations

})
export class QueueComponent implements OnInit {
    searchInput: FormControl;

    constructor() {
    }

    ngOnInit() {
    }

}
