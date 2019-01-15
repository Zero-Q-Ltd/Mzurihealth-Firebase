import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Patient} from '../../../../models/Patient';
import {fuseAnimations} from '../../../../../@fuse/animations';

@Component({
    selector: 'queue-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MainComponent implements OnInit {
    patientsdatasource = new MatTableDataSource<Patient>();
    patientsheaders = ['FileNo', 'Photo', 'Name', 'ID', 'Age', 'Phone', 'Last Visit', 'Status'];

    constructor() {
    }

    ngOnInit() {
    }

}
