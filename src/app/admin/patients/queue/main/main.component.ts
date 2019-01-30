import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {QueueService} from '../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../models/MergedPatient_Queue.model';
import {InvoiceComponent} from '../../invoice/invoice.component';
import {AdminSelectionComponent} from '../admin-selection/admin-selection.component';
import {HospitalAdmin} from '../../../../models/HospitalAdmin';
import {FuseConfirmDialogComponent} from '../../../../../@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'queue-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MainComponent implements OnInit {
    patientsdatasource = new MatTableDataSource<MergedPatient_QueueModel>();
    patientsheaders = ['FileNo', 'Photo', 'Name', 'ID', 'Age', 'Phone', 'Last Visit', 'Status', 'Action'];
    dialogRef: MatDialogRef<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private queue: QueueService,
                public _matDialog: MatDialog) {
        queue.mainpatientqueue.subscribe(value => {
            this.patientsdatasource.data = value;
        });
    }

    ngOnInit(): void {
    }

    redirectadmin(data: MergedPatient_QueueModel): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Redirect Patient?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    showadminchoice(data: MergedPatient_QueueModel): void {
        this.dialogRef = this._matDialog.open(AdminSelectionComponent, {});

        this.dialogRef.afterClosed().subscribe((res: HospitalAdmin) => {
            console.log(res);
            if (res) {
                this.queue.assignadmin(data.queuedata, res.id);
            }
        });
    }

    viewinvoice(data: MergedPatient_QueueModel): void {
        this.dialogRef = this._matDialog.open(InvoiceComponent, {
            data: {
                patient: data,
                action: 'save'
            }
        });

        this.dialogRef.afterClosed();
    }

    payinvoice(data: MergedPatient_QueueModel): void {

    }

}
