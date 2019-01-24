import {Component, OnInit} from '@angular/core';
import {emptyprocedureperformed, Procedureperformed} from '../../../../../models/Procedureperformed';
import {HospitalAdmin} from '../../../../../models/HospitalAdmin';
import {HospitalService} from '../../../../services/hospital.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientService} from '../../../../services/patient.service';
import {PatienthistoryService} from '../../../../services/patienthistory.service';
import {RawProcedure, rawprocedurecategory} from '../../../../../models/RawProcedure';
import {CustomProcedure} from '../../../../../models/CustomProcedure';
import {ProceduresService} from '../../../../services/procedures.service';
import {MatTableDataSource} from '@angular/material';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {ProcedureCategory} from '../../../../../models/ProcedureCategory';

@Component({
    selector: 'patient-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss'],
    animations: [fuseAnimations]

})
export class TodayComponent implements OnInit {
    procedurestoday: Array<Procedureperformed> = [];
    procedureperformed: FormGroup;
    vitalsform: FormGroup;
    hospitalprocedures: MatTableDataSource<{ rawprocedure: RawProcedure, customprocedure: CustomProcedure }> = new MatTableDataSource();
    procedureheaders = ['name', 'category'];
    selectedprocedure: { rawprocedure: RawProcedure, customprocedure: CustomProcedure };
    expand = true;
    procedurecategories: Array<ProcedureCategory>;

    constructor(private hospitalservice: HospitalService,
                private formBuilder: FormBuilder,
                private patientservice: PatientService,
                private procedureservice: ProceduresService,
                private patienthistory: PatienthistoryService) {
        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures.data = mergedprocedures;
        });
        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
        this.initproceduresformm();
        this.initvitalsformm();

        this.hospitalprocedures.filterPredicate = (data: { rawprocedure: RawProcedure, customprocedure: CustomProcedure }, filter: string) => data.rawprocedure.name.indexOf(filter) !== -1;
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

    applyFilter(filterValue: string): void {
        this.hospitalprocedures.filter = filterValue.trim().toLowerCase();
    }

    onSelect(selected: { rawprocedure: RawProcedure, customprocedure: CustomProcedure }): void {
        this.selectedprocedure = selected;
    }

    getcategory(category: rawprocedurecategory): string {
        if (category && category.subcategoryid) {
            return this.procedurecategories.find(cat => {
                return cat.id === category.id;
            }).subcategories[category.subcategoryid].name;
        } else {
            return '';
        }
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
            this.expand = false;
            const procedure: Procedureperformed = Object.assign({}, {...emptyprocedureperformed}, this.procedureperformed.getRawValue());
            // this.patientservice.
        }
    }

    ngOnInit(): void {
    }

}
