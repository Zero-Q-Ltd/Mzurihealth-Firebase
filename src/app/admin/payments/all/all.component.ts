import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Patient} from '../../../models/Patient';
import {emptyhospital, Hospital} from '../../../models/Hospital';
import {HospitalAdmin} from '../../../models/HospitalAdmin';
import {Paymentmethods} from '../../../models/PaymentChannel';
import {FuseConfirmDialogComponent} from '../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {FormGroup} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {InvoiceCustomizationComponent} from '../../patients/invoice-customization/invoice-customization.component';
import {MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';
import {PatientService} from '../../services/patient.service';
import {HospitalService} from '../../services/hospital.service';
import {QueueService} from '../../services/queue.service';

@Component({
    selector: 'app-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AllComponent implements OnInit {
    viewcriteria: 'week' | 'month' | 'year' = 'week';
    patientsdatasource = new MatTableDataSource<Patient>();
    patientsheaders = ['FileNo', 'Photo', 'name', 'ID', 'Phone', 'Procedures', 'Amount'];
    activehospital: Hospital = Object.assign({}, emptyhospital);
    hospitaladmins: Array<HospitalAdmin> = [];
    userdata: HospitalAdmin;
    dialogRef: any;
    allInsurance: { [key: string]: Paymentmethods } = {};
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    searchForm: FormGroup;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public _matDialog: MatDialog,
                private patientservice: PatientService,
                private queueService: QueueService,) {
    }

    viewinvoice(data: MergedPatient_QueueModel): void {
        event.stopPropagation();
        this.dialogRef = this._matDialog.open(InvoiceCustomizationComponent, {
            data: data,
            width: '90%'
        });

        this.dialogRef.afterClosed();
    }

    changecriteria(value: 'week' | 'month' | 'year'): void {
        if (this.viewcriteria !== value) {
            this.queueService
        }
    }

    ngOnInit(): void {
    }

}
