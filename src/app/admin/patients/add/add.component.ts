import {Component, Inject, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {InsuranceCompany} from '../../../models/InsuranceCompany';
import {MAT_DIALOG_DATA} from '@angular/material';
import {NotificationService} from '../../../shared/services/notifications.service';
import {InsuranceService} from '../../services/insurance.service';
import {AdminService} from '../../services/admin.service';
import {PatientService} from '../../services/patient.service';
import {HospitalService} from '../../services/hospital.service';
import {emptyhospital, Hospital} from '../../../models/Hospital';
import {emptypatienthistory, PatientVisit} from '../../../models/PatientVisit';
import {emptypatient, Patient} from '../../../models/Patient';
import {emptyfile, HospFile} from '../../../models/HospFile';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AddComponent implements OnInit {
    patientfileno: HospFile = Object.assign({}, emptyfile);
    temppatient: Patient = emptypatient;
    insurancename: any;
    invalidinsurance: boolean = true;
    temphistory: PatientVisit = {... emptypatienthistory};
    activehospital: Hospital = Object.assign({}, emptyhospital);
    allinsurance = [];
    patientsform: FormGroup;

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private _formBuilder: FormBuilder,
                private hospitalservice: HospitalService,
                private insuranceservice: InsuranceService,
                private notificationservice: NotificationService,
                @Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.patientfileno.no = (hospital.patientcount + 1).toString();
            }
        });
        this.insuranceservice.allinsurance.subscribe(insurances => {
            this.allinsurance = insurances;
        });

    }

    selectinsurance(data) {
        this.invalidinsurance = false;
        console.log(data);
        let insurance = data.item as InsuranceCompany;
        // Data needs to be replicated for the patient and the patient history
        this.temppatient.insurance[insurance.id] = {
            insuranceno: '',
            id: insurance.id
        };
        // this.temphistory.paymentmethod.data = data.item;
    }

    resetinsurance(data) {
        this.invalidinsurance = true;
    }

    gettime() {
        return moment().format('LLL');
    }

    ngOnInit() {
        this.patientsform = this._formBuilder.group({
            company: [
                {
                    value: 'Google',
                    disabled: true
                }, Validators.required
            ],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            address2: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]],
            country: ['', Validators.required]
        });

    }

    addpatient(saveandqueue: boolean) {
        if (saveandqueue) {
            // this.temppatient.Checkin[this.activehospital.id] = {
            //     superadmin: null,
            //     status: 0
            // };
        }
        this.patientservice.validatefileno(this.patientfileno.no).get().then(data => {
            if (data.empty) {
                this.patientfileno.date = this.patientfileno.lastvisit = moment().toDate() as any;
                this.patientservice.addpatient(this.temppatient, this.temphistory, saveandqueue, this.patientfileno).then(() => {
                    this.notificationservice.notify({
                        alert_type: 'success',
                        body: 'Patient registration successful',
                        title: 'Success',
                        placement: 'center'
                    });
                    this.temppatient = emptypatient;
                });
            } else {
                this.notificationservice.notify({
                    alert_type: 'error',
                    body: 'File number has been used',
                    title: 'ERROR',
                    placement: 'center'
                });
            }
        });

    }

}
