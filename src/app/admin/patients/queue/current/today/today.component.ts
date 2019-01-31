import {Component, OnInit} from '@angular/core';
import {emptyprocedureperformed, Procedureperformed} from '../../../../../models/Procedureperformed';
import {HospitalAdmin} from '../../../../../models/HospitalAdmin';
import {HospitalService} from '../../../../services/hospital.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientService} from '../../../../services/patient.service';
import {PatientvisitService} from '../../../../services/patientvisit.service';
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
import {QueueService} from '../../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../../models/MergedPatient_Queue.model';
import {AdminSelectionComponent} from '../../admin-selection/admin-selection.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {NotificationService} from '../../../../../shared/services/notifications.service';

@Component({
    selector: 'patient-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss'],
    animations: [fuseAnimations]

})
export class TodayComponent implements OnInit {
    currentvisitprocedures: Array<Procedureperformed> = [];
    procedureperformed: FormGroup;
    vitalsform: FormGroup;
    hospitalprocedures: Array<MergedProcedureModel> = [];
    selectedprocedure: { rawprocedure: RawProcedure, customprocedure: CustomProcedure };
    currentpatient: MergedPatient_QueueModel;
    expand = true;
    procedurecategories: Array<ProcedureCategory>;
    procedureselection: FormGroup;
    allergiesform: FormGroup;
    allergytypes = allerytypearray;
    medconditionsform: FormGroup;
    medconditiontypes = medicalconditionsarray;
    filteredprocedures: Observable<MergedProcedureModel[]>;
    dialogRef: MatDialogRef<any>;

    constructor(private hospitalservice: HospitalService,
                private formBuilder: FormBuilder,
                private patientservice: PatientService,
                private procedureservice: ProceduresService,
                private queue: QueueService,
                public _matDialog: MatDialog,
                private notification: NotificationService,
                private patientvisit: PatientvisitService) {

        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
        this.initformms();

        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures = mergedprocedures;
            this.procedureselection.get('selection').setValidators([Validators.required, ProcedureValidator.available(this.hospitalprocedures)]);
        });
        queue.currentvisitprocedures.subscribe(value => {
            this.currentvisitprocedures = value;
        });
        queue.currentpatient.subscribe(value => {
            this.currentpatient = value;
            this.initvitalsformm();
        });
        this.filteredprocedures = this.procedureselection.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );

    }

    private _filter(value: { selection: MergedProcedureModel | string }): MergedProcedureModel[] {
        if (!value || typeof value.selection !== 'string') {
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
        /**
         * neccessary the first time the form is created to allow enabling
         */
        this.allergychanges();
        this.conditionschanges();
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
        console.log('snodnsdf');
        console.log(this.vitalsform.getRawValue());
        console.log(this.allergiesform.getRawValue());
        console.log(this.medconditionsform.getRawValue());
        // this.patientservice.updatePatient(this.queue.currentpatient.value.patientdata.id, );
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

    showadminchoice(): void {

        this.dialogRef = this._matDialog.open(AdminSelectionComponent, {});

        this.dialogRef.afterClosed().subscribe((res: HospitalAdmin) => {
            console.log(res);
            if (res) {
                console.log(res);
                this.queue.assignadmin(this.currentpatient.queuedata, res.id);
            }
        });
    }

    exitpatientandacceptnext(): void {


    }

    exitpatientandbreak(): void {

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
        const height = new FormControl(this.currentpatient.patientdata.medicalinfo.vitals.height);
        const weight = new FormControl(this.currentpatient.patientdata.medicalinfo.vitals.weight);
        const pressure = new FormControl(this.currentpatient.patientdata.medicalinfo.vitals.pressure);
        const heartrate = new FormControl(this.currentpatient.patientdata.medicalinfo.vitals.heartrate);
        const sugar = new FormControl(this.currentpatient.patientdata.medicalinfo.vitals.sugar);
        const respiration = new FormControl(this.currentpatient.patientdata.medicalinfo.vitals.respiration);
        this.vitalsform = new FormGroup({
            height: height,
            weight: weight,
            pressure: pressure,
            heartrate: heartrate,
            sugar: sugar,
            respiration: respiration,
        });
    }

    procedureselectiondisplayfn(data ?: MergedProcedureModel): string {
        return data ? data.rawprocedure.name : '';
    }

    createNotes(): FormGroup {
        const note = new FormControl('');
        return this.formBuilder.group({
            note: note,
        });
    }

    updategeneralreport(): void {
        console.log('aondklilands');
    }

    addprocedure(): void {
        console.log(this.procedureselection.getRawValue());
        if (this.procedureperformed.valid) {
            this.expand = false;
            const procedure: Procedureperformed = Object.assign({}, {...emptyprocedureperformed}, this.procedureperformed.getRawValue());
            const originaldata: MergedProcedureModel = this.procedureselection.getRawValue().selection;
            this.queue.addprocedure(originaldata, procedure);
        }
    }

    ngOnInit(): void {
    }

}
