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

    constructor(private adminservice: AdminService,
                private patientservice: PatientService,
                private queueservice: QueueService,
                private hospitalservice: HospitalService,
                private insuranceservice: InsuranceService,
                private dialog: MatDialog) {
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

    chooseadmin(patientdata: Patient) {
        this.queueservice.assignadmin(patientdata);
    }

    showinvoice(patientid, adminid) {
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
