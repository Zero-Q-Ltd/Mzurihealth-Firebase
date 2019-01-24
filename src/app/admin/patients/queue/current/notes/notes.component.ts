import {Component, OnInit} from '@angular/core';
import {emptynote, Patientnote} from '../../../../../models/Patientnote';
import {PatientService} from '../../../../services/patient.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'patient-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
    patientnotes: Array<Patientnote> = [];
    emptynote: Patientnote = {...emptynote};
    newnote: FormGroup;

    constructor(private patientservice: PatientService) {
        this.initformm();
    }

    ngOnInit(): void {
    }

    initformm(): void {
        const title = new FormControl('', [Validators.required, Validators.maxLength(80)]);
        const note = new FormControl('', [Validators.required, Validators.maxLength(600)]);

        this.newnote = new FormGroup({
            title: title,
            note: note
        });
    }

    addhelpful(): void {

    }

    addnote(): void {
        // patientservice.addpatientnote();
    }
}
