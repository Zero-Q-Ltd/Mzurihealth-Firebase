import {Component, OnInit} from '@angular/core';
import {emptyproceduresperformed, Procedureperformed} from '../../../../../models/Procedureperformed';
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
import {BehaviorSubject, Observable} from 'rxjs';
import {MergedProcedureModel} from '../../../../../models/MergedProcedure.model';
import {map, startWith} from 'rxjs/operators';
import {allerytypearray} from '../../../../../models/Allergy.model';
import {medicalconditionsarray} from '../../../../../models/MedicalConditions.model';
import {QueueService} from '../../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../../models/MergedPatient_Queue.model';
import {AdminSelectionComponent} from '../../admin-selection/admin-selection.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {LocalcommunicationService} from '../localcommunication.service';
import {emptypatientvisit, PatientVisit} from '../../../../../models/PatientVisit';
import {NotificationService} from '../../../../../shared/services/notifications.service';

@Component({
    selector: 'patient-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss'],
    animations: [fuseAnimations]

})
export class TodayComponent implements OnInit {
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
    imeanzilishwa: BehaviorSubject<boolean> = new BehaviorSubject(false);
    hospitaladmins: Array<HospitalAdmin> = [];
    currentvisit: PatientVisit = {...emptypatientvisit};

    constructor(private hospitalservice: HospitalService,
                private formBuilder: FormBuilder,
                private patientservice: PatientService,
                private procedureservice: ProceduresService,
                private queue: QueueService,
                public _matDialog: MatDialog,
                private patientvisitservice: PatientvisitService,
                private communication: LocalcommunicationService,
                private notifications: NotificationService) {

        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
        hospitalservice.hospitaladmins.subscribe(admins => {
            this.hospitaladmins = admins;
        });

        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures = mergedprocedures;
        });
        queue.currentpatient.subscribe(value => {
            this.currentpatient = value;
            this.anzisha();
            this.imeanzilishwa.next(true);
        });
        patientvisitservice.currentvisit.subscribe(visit => {
            console.log(visit);
            this.currentvisit = visit;
        });
        this.filteredprocedures = this.procedureselection.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
    }

    anzisha(): void {
        this.initprocedureform();
        this.initvitalsformm();
        this.initconditionsallergiesforms();
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
    initprocedureform(): void {
        const results = new FormControl('', [Validators.required]);
        const notes = new FormControl('', [Validators.required]);
        this.procedureperformed = new FormGroup({
            results: results,
            notes: notes
        });
        const selection = new FormControl('');

        this.procedureselection = new FormGroup({
            selection: selection,
        });
    }

    /**
     * mzio ni allergy. Iga ni copy
     * Food for thought
     * @param mzio
     */
    igamizio(mzio): FormGroup {
        const allergy = new FormControl({
            value: mzio.type,
            disabled: false
        });

        const detail = new FormControl({
            value: mzio.detail,
            disabled: false
        });

        return this.formBuilder.group({
            type: allergy,
            detail: detail
        });
    }

    /**
     * iga ni copy, matatizo ni condition (I think?)
     * @param tatizo
     */
    igamatatizo(tatizo): FormGroup {
        const allergy = new FormControl({
            value: tatizo.type,
            disabled: false
        });

        const detail = new FormControl({
            value: tatizo.detail,
            disabled: false
        });

        return this.formBuilder.group({
            type: allergy,
            detail: detail
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

    updateVitalsAllegiesConditions(): void {
        this.patientservice.updateVitalsAllegiesConditions(this.currentpatient.patientdata.id,
            this.vitalsform.getRawValue(),
            this.medconditionsform.getRawValue().conditionsformArray,
            this.allergiesform.getRawValue().allergiesformArray).then(() => {
            this.notifications.notify({
                placement: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                title: 'Success',
                alert_type: 'success',
                body: 'Saved'
            });
        });
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
                this.queue.assignadmin(this.currentpatient.queuedata, res.id).then(() => {
                    /**
                     * important to change from the currently active tab as it will become inactive
                     */
                    this.communication.ontabchanged.next(1);
                });
                ;
            }
        });
    }

    exitpatientandacceptnext(): void {
        /**
         * first check if there's a next patient
         */
        if (this.queue.mypatientqueue.value[1]) {
            this.queue.acceptpatient(this.queue.mypatientqueue.value[1].queuedata);
        } else {

        }
        this.patientvisitservice.awaitpayment(this.currentpatient.queuedata.id).then(() => {
            /**
             * important to change from the currently active tab as it will become inactive
             */
            this.communication.ontabchanged.next(1);
        });
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

    procedureselectiondisplayfn(data?: MergedProcedureModel): string {
        return data ? data.rawprocedure.name : '';
    }

    saveprescription(): void {
        this.patientvisitservice.setprescription(this.currentvisit.id, this.currentvisit.prescription).then(() => {
            this.notifications.notify({
                placement: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                title: 'Success',
                alert_type: 'success',
                body: 'Saved'
            });
        });
    }

    addprocedure(): void {
        // return console.log(this.procedureselection.getRawValue());
        if (this.procedureperformed.valid) {
            this.expand = false;
            const procedure: Procedureperformed = Object.assign({}, {...emptyproceduresperformed}, this.procedureperformed.getRawValue());
            const originaldata: MergedProcedureModel = this.procedureselection.getRawValue().selection;
            this.patientvisitservice.addprocedure(this.currentvisit.id, originaldata, procedure).then(() => {
                this.notifications.notify({
                    placement: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    title: 'Success',
                    alert_type: 'success',
                    body: 'Saved'
                });
            });
            ;
        }
    }

    ngOnInit(): void {
    }

    private initconditionsallergiesforms(): void {
        this.allergiesform = this.formBuilder.group({
            allergiesformArray: this.formBuilder.array(this.currentpatient.patientdata.medicalinfo.allergies.map(mzio => {
                return this.igamizio(mzio);
            }))
        });
        this.medconditionsform = this.formBuilder.group({
            conditionsformArray: this.formBuilder.array(this.currentpatient.patientdata.medicalinfo.conditions.map(tatizo => {
                return this.igamatatizo(tatizo);
            }))
        });
        /**
         * neccessary the first time the form is created to allow enabling
         */
        this.allergychanges();
        this.conditionschanges();
    }

    private _filter(value: { selection: MergedProcedureModel | string }): MergedProcedureModel[] {
        if (!value || typeof value.selection !== 'string') {
            return this.hospitalprocedures;
        }
        const filterValue = value.selection.toLowerCase();
        return this.hospitalprocedures.filter(option => option.rawprocedure.name.toLowerCase().includes(filterValue));
    }

}
