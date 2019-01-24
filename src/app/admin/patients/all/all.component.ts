import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Patient} from '../../../models/Patient';
import * as moment from 'moment';
import {firestore} from 'firebase';
import {HospitalAdmin} from '../../../models/HospitalAdmin';
import {QueueService} from '../../services/queue.service';
import {emptyhospital, Hospital} from '../../../models/Hospital';
import {AdminService} from '../../services/admin.service';
import {InsuranceService} from '../../services/insurance.service';
import {PatientService} from '../../services/patient.service';
import {HospitalService} from '../../services/hospital.service';
import {PushqueueComponent} from '../pushqueue/pushqueue.component';
import {FormGroup} from '@angular/forms';
import {NotificationService} from '../../../shared/services/notifications.service';
import {Router} from '@angular/router';

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
    allinsurance = [];
    hospitaladmins: Array<HospitalAdmin> = [];
    userdata: HospitalAdmin;
    allpatientqueue: Array<Patient> = [];
    currentuserqueue: Array<Patient> = [];
    dialogRef: any;

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private queueservice: QueueService,
                private hospitalservice: HospitalService,
                private insuranceservice: InsuranceService,
                private notificationservice: NotificationService,
                private dialog: MatDialog,
                public _matDialog: MatDialog, private router: Router) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
            }
        });
        this.insuranceservice.allinsurance.subscribe(insurances => {
            this.allinsurance = insurances;
        });
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.data.uid) {
                this.userdata = admin;
            }
        });
        this.patientservice.hospitalpatients.subscribe(patients => {
            this.patientsdatasource.data = patients;
        });
        this.queueservice.allpatientqueue.subscribe(allpatientsinqueue => {
            this.allpatientqueue = allpatientsinqueue;
            // this.currentuserqueue = allpatientsinqueue.filter(patient => patient.Checkin[this.activehospital.id].admin === this.userdata.id);
        });
    }

    ngOnInit(): void {

    }

    getAge(birtday: firestore.Timestamp): number {
        return moment().diff(birtday.toDate().toLocaleDateString(), 'years');
    }

    addToQueue(patient: Patient): void {
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
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        this.patientservice.addPatientToQueue(formData.getRawValue(), patient)
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
                                placement: 'center'
                            });
                        });

                        break;
                }
            });
    }

    chooseadmin(patientdata: Patient): any {
        this.queueservice.assignadmin(patientdata);
    }

    showinvoice(patientid, adminid): any {
        // let dialogRef = this.dialog.open(InvoiceComponent, {
        //     width: '95%',
        //     data: {['patientid']: patientid, ['adminid']: adminid}
        //     // disableClose: true,
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //
        //     if (result) {
        //         // this.chosenadmin = result
        //         console.log(result);
        //
        //     }
        //     // console.log(this.chooseadmin)
        // });
    }

}
