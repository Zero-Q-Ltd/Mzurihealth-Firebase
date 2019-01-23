import {Component, Input, OnInit} from '@angular/core';
import {emptypatient, Patient} from '../../../../../models/Patient';
import {Patientnotes} from '../../../../../models/PatientNotes';

@Component({
    selector: 'patient-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
    patientnotes: Array<Patientnotes> = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    addhelpful(): void {

    }

    addnote(): void {

    }
}
