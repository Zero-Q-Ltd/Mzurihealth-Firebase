import {Component, OnInit} from '@angular/core';
import {emptyprocedureperformed, Procedureperformed} from '../../../../../models/Procedureperformed';
import {HospitalAdmin} from '../../../../../models/HospitalAdmin';
import {HospitalService} from '../../../../services/hospital.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientService} from '../../../../services/patient.service';

@Component({
    selector: 'patient-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
    procedurestoday: Array<Procedureperformed> = [];
    procedureperformed: FormGroup;

    constructor(private hospitalservice: HospitalService, private formBuilder: FormBuilder, private patientservice: PatientService) {
    }

    getadmin(adminid: string): HospitalAdmin {
        return this.hospitalservice.hospitaladmins.value.find(admin => {
            return admin.id === adminid;
        });
        this.initformm();
    }

    initformm(): void {
        const results = new FormControl('', [Validators.required]);
        this.procedureperformed = new FormGroup({
            results: results,
            notes: this.createNotes()
        });
    }

    createNotes(): FormGroup {
        const note = new FormControl('');
        return this.formBuilder.group({
            note: note,
        });
    }

    addprocedure(): void {
        if (this.procedureperformed.valid) {
            const procedure: Procedureperformed = Object.assign({}, {...emptyprocedureperformed}, this.procedureperformed.getRawValue());
            this.patientservice.
        }
    }

    ngOnInit(): void {
    }

}
