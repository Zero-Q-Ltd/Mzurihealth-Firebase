import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Patient} from '../../../models/Patient';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-pushqueue',
    templateUrl: './pushqueue.component.html',
    styleUrls: ['./pushqueue.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PushqueueComponent implements OnInit {

    queueForm: FormGroup;
    patient: Patient;
    dialogTitle: string;


    constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) private _data: any,
                public matDialogRef: MatDialogRef<PushqueueComponent>) {
        this.patient = _data.patient;
        this.dialogTitle = 'Queue Patient';

        this.queueForm = this.createQueueForm();
    }

    ngOnInit(): void {
    }

    createQueueForm(): FormGroup {
        return this._formBuilder.group({
            type: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

}
