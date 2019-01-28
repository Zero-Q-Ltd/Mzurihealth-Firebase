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
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {ProcedureCategory} from '../../../../../models/ProcedureCategory';
import {ProcedureValidator} from '../../../../validators/procedure.validator';
import {Observable} from 'rxjs';
import {MergedProcedureModel} from '../../../../../models/MergedProcedure.model';
import {map, startWith} from 'rxjs/operators';
import {allerytypearray} from '../../../../../models/Allergies.model';
import {medicalconditionsarray} from '../../../../../models/MedicalConditions.model';

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
    hospitalprocedures: Array<MergedProcedureModel> = [];
    selectedprocedure: { rawprocedure: RawProcedure, customprocedure: CustomProcedure };
    expand = true;
    procedurecategories: Array<ProcedureCategory>;
    procedureselection: FormGroup;
    allergiesform: FormGroup;
    allergytypes = allerytypearray;
    medconditionsform: FormGroup;
    medconditiontypes = medicalconditionsarray;
    filteredprocedures: Observable<MergedProcedureModel[]>;

    constructor(private hospitalservice: HospitalService,
                private formBuilder: FormBuilder,
                private patientservice: PatientService,
                private procedureservice: ProceduresService,
                private patienthistory: PatienthistoryService) {

        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
        this.initformms();

        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures = mergedprocedures;
            this.procedureselection.get('selection').setValidators([Validators.required, ProcedureValidator.available(this.hospitalprocedures)]);
        });

        this.filteredprocedures = this.procedureselection.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
        this.initvitalsformm();
    }

    private _filter(value): MergedProcedureModel[] {
        if (!value) {
            return this.hospitalprocedures;
        }
        const filterValue = value.selection.toLowerCase();
        return this.hospitalprocedures.filter(option => option.rawprocedure.name.toLowerCase().includes(filterValue));
    }

    /**
     * returns the admin object from the list of hospital admins
     * @param adminid
     */
    getadmin(adminid: string): HospitalAdmin {
        return this.hospitalservice.hospitaladmins.value.find(admin => {
            return admin.id === adminid;
        });
    }

    /**
     * initializes forms and from controls
     */
    initformms(): void {
        const results = new FormControl('', [Validators.required]);
        this.procedureperformed = new FormGroup({
            results: results,
            notes: this.createNotes()
        });
        const selection = new FormControl('',);

        this.procedureselection = new FormGroup({
            selection: selection,
        });
        this.allergiesform = this.formBuilder.group({
            allergiesformArray: this.formBuilder.array([this.createallergies()])
        });
        this.medconditionsform = this.formBuilder.group({
            conditionsformArray: this.formBuilder.array([this.createmedconditions()])
        });
    }

    createallergies(): FormGroup {
        const allergy = new FormControl('');

        const detail = new FormControl({
            value: '',
            disabled: true
        });

        return this.formBuilder.group({
            type: allergy,
            detail: detail
        });
    }

    createmedconditions(): FormGroup {
        const condition = new FormControl('');

        const detail = new FormControl({
            value: '',
            disabled: true
        });

        return this.formBuilder.group({
            type: condition,
            detail: detail
        });
    }

    updatepatient(): void {
        // this.patientservice.hospitalpatients

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

    addallergy(): void {
        // @ts-ignore
        this.allergiesform.get('allergiesformArray').push(this.createallergies());

        this.allergychanges();
    }

    deleteallergy(index: number): void {
        // @ts-ignore
        this.allergiesform.get('allergiesformArray').removeAt(index);
        this.allergychanges();

    }

    allergychanges(): void {
        // @ts-ignore
        this.allergiesform.get('allergiesformArray').controls.forEach(x => {
            x.get('type').valueChanges.subscribe(g => {
                if (g) {
                    if (x.get('type').value.toString().length > -1) {
                        x.get('detail').enable({emitEvent: false});
                    } else {
                        x.get('detail').disable({emitEvent: false});
                    }
                }
            });
        });
    }

    addcondition(): void {
        // @ts-ignore
        this.medconditionsform.get('conditionsformArray').push(this.createmedconditions());

        this.conditionschanges();
    }

    deletecondition(index: number): void {
        // @ts-ignore
        this.medconditionsform.get('conditionsformArray').removeAt(index);
        this.conditionschanges();

    }

    conditionschanges(): void {
        // @ts-ignore
        this.medconditionsform.get('conditionsformArray').controls.forEach(x => {
            x.get('type').valueChanges.subscribe(g => {
                if (g) {
                    if (x.get('type').value.toString().length > -1) {
                        x.get('detail').enable({emitEvent: false});
                    } else {
                        x.get('detail').disable({emitEvent: false});
                    }
                }
            });
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
            this.expand = false;
            const procedure: Procedureperformed = Object.assign({}, {...emptyprocedureperformed}, this.procedureperformed.getRawValue());
            // this.patientservice.
        }
    }

    ngOnInit(): void {
    }

}
