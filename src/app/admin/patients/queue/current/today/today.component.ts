import {Component, OnInit} from '@angular/core';
import {emptyprocedureperformed, Procedureperformed} from '../../../../../models/Procedureperformed';
import {HospitalAdmin} from '../../../../../models/HospitalAdmin';
import {HospitalService} from '../../../../services/hospital.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientService} from '../../../../services/patient.service';
import {PatienthistoryService} from '../../../../services/patienthistory.service';
import {RawProcedure} from '../../../../../models/RawProcedure';
import {CustomProcedure} from '../../../../../models/CustomProcedure';
import {ProceduresService} from '../../../../services/procedures.service';

@Component({
    selector: 'patient-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
    procedurestoday: Array<Procedureperformed> = [];
    procedureperformed: FormGroup;
    vitalsform: FormGroup;
    hospitalprocedures: Array<{ rawprocedure: RawProcedure, customprocedure: CustomProcedure }> = [];

    constructor(private hospitalservice: HospitalService,
                private formBuilder: FormBuilder,
                private patientservice: PatientService,
                private procedureservice: ProceduresService,
                private patienthistory: PatienthistoryService) {
        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures = mergedprocedures;
        });
        this.initproceduresformm();
        this.initvitalsformm();
    }

    getadmin(adminid: string): HospitalAdmin {
        return this.hospitalservice.hospitaladmins.value.find(admin => {
            return admin.id === adminid;
        });
    }

    initproceduresformm(): void {
        const results = new FormControl('', [Validators.required]);
        this.procedureperformed = new FormGroup({
            results: results,
            notes: this.createNotes()
        });
    }

    initvitalsformm(): void {
        const height = new FormControl('',);
        const weight = new FormControl('',);
        const pressure = new FormControl('',);
        const heartrate = new FormControl('',);
        const sugar = new FormControl('',);
        const respiration = new FormControl('',);
        this.vitalsform = new FormGroup({
            height: height,
            weight: weight,
            pressure: pressure,
            heartrate: heartrate,
            sugar: sugar,
            respiration: respiration,
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
            // this.patientservice.
        }
    }

    ngOnInit(): void {
    }

}
