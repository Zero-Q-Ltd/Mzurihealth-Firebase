import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {RawProcedure} from '../../../../models/RawProcedure';

@Component({
    selector: 'procedures-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
    categoryprocedures = new MatTableDataSource<RawProcedure>();

    constructor() {
    }

    ngOnInit() {
    }

}
