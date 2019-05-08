import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProcedureNotes} from '../../../../../models/Procedureperformed';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AdminService} from '../../../../services/admin.service';
import {PatientVisit} from '../../../../../models/PatientVisit';
import {PatientvisitService} from '../../../../services/patientvisit.service';

@Component({
    selector: 'app-procedurenotes',
    templateUrl: './procedurenotes.component.html',
    styleUrls: ['./procedurenotes.component.scss']
})
export class ProcedurenotesComponent implements OnInit {
    private procedurenores: Array<ProcedureNotes>;
    newnoteform: FormGroup;
    patientvisit: PatientVisit;

    constructor(public dialogRef: MatDialogRef<ProcedurenotesComponent>,
                private adminservice: AdminService,
                private patientvisitservice: PatientvisitService,
                @Inject(MAT_DIALOG_DATA) private procedureid: number
    ) {
        console.log(this.procedureid);
        this.patientvisitservice.currentvisit.subscribe(value => {

            if (this.patientvisit) {
                /**
                 * @TODO Make sure the number of notes has not changed so that the ref ID still points to the right procedure
                 */
                if (this.patientvisit.procedures[this.procedureid].notes.length !== value.procedures[this.procedureid].notes.length) {

                }
            } else {
                this.patientvisit = value;
                this.procedurenores = value.procedures[this.procedureid].notes;

            }
        });
        this.initformm();
    }

    ngOnInit(): void {
    }

    initformm(): void {
        const note = new FormControl('', [Validators.required, Validators.maxLength(600), Validators.minLength(10)]);
        this.newnoteform = new FormGroup({
            note: note
        });
    }

    addnote(): void {
        if (this.newnoteform.valid) {
            this.procedurenores.push(Object.assign({
                admin: {
                    id: this.adminservice.userdata.id,
                    name: this.adminservice.userdata.data.displayName
                },
                note: ''
            }, this.newnoteform.getRawValue()));
        }
    }
}
