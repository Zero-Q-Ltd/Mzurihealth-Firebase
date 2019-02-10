import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {emptypatient, Patient} from '../../../models/Patient';
import * as moment from 'moment';
import {firestore} from 'firebase';
import {HospitalAdmin} from '../../../models/HospitalAdmin';
import {emptyhospital, Hospital} from '../../../models/Hospital';
import {AdminService} from '../../services/admin.service';
import {PatientService} from '../../services/patient.service';
import {HospitalService} from '../../services/hospital.service';
import {PushqueueComponent} from '../pushqueue/pushqueue.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../shared/services/notifications.service';
import {Router} from '@angular/router';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {Paymentmethods} from '../../../models/PaymentChannel';
import {QueueService} from '../../services/queue.service';

@Component({
    selector: 'all-patients',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AllComponent implements OnInit {
    patientsdatasource = new MatTableDataSource<Patient>();
    patientsheaders = ['FileNo', 'Photo', 'Name', 'ID', 'Age', 'Phone', 'Last Visit', 'Status'];
    activehospital: Hospital = Object.assign({}, emptyhospital);
    hospitaladmins: Array<HospitalAdmin> = [];
    userdata: HospitalAdmin;
    dialogRef: any;
    allInsurance: { [key: string]: Paymentmethods } = {};

    searchForm: FormGroup;

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private hospitalservice: HospitalService,
                private paymentethods: PaymentmethodService,
                private notificationservice: NotificationService,
                private dialog: MatDialog, private queueService: QueueService,
                private formBuilder: FormBuilder,
                public _matDialog: MatDialog, private router: Router) {

        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
            }
        });
        this.queueService.mainpatientqueue.subscribe();

        this.paymentethods.allinsurance.subscribe(insurance => {
            this.allInsurance = insurance;
        });
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.data.uid) {
                this.userdata = admin;
            }
        });
        this.patientservice.hospitalpatients.subscribe(patients => {
            this.patientsdatasource.data = patients;
        });

        this.initialSearchForm();
    }

    ngOnInit(): void {

    }

    getAge(birtday: firestore.Timestamp): number {
        return moment().diff(birtday.toDate().toLocaleDateString(), 'years');
    }

    addToQueue(patient: Patient): void {

        const fil = this.queueService.mainpatientqueue.value.filter(value => {
            return value.patientdata.id === patient.id;
        });

        if (fil.length !== 0) {
            this.notificationservice.notify({
                alert_type: 'error',
                body: 'The user in the main queue',
                title: 'ERROR',
                placement: {horizontal: 'center', vertical: 'top'}
            });
            return;
        }
        this.dialogRef = this._matDialog.open(PushqueueComponent, {
            panelClass: 'all-patients',
            data: {
                patient: patient,
                action: 'save'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: { data: FormGroup, selected: { insuranceControl: string, insurancenumber: string } } = response[1];

                console.log(formData.data.getRawValue());

                switch (actionType) {
                    /**
                     * Save
                     */

                    case 'save':
                        this.patientservice.addPatientToQueue(formData.data.getRawValue(), patient, formData.selected)
                            .then(() => {
                                // navigate to queues
                                this.router.navigate(['admin/patients/queue']);
                            }).catch(error => {
                            console.log('form error');
                            console.log(error);


                            this.notificationservice.notify({
                                alert_type: 'error',
                                body: 'An error occurred',
                                title: 'ERROR',
                                placement: {horizontal: 'right', vertical: 'top'}
                            });
                        });

                        break;
                }
            });
    }


    private initialSearchForm(): void {
        this.searchForm = this.formBuilder.group({
            field: new FormControl('', [
                Validators.required,
            ]),
            fieldValue: new FormControl('', [
                Validators.required
            ]),
        });
    }


    submitSearchForm(): void {
        if (this.searchForm.invalid) {
            return;
        }

        const {field, fieldValue} = this.searchForm.value;
        this.patientservice.searchPatient(field, fieldValue);
    }
}
