import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {QueueService} from '../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../models/MergedPatient_Queue.model';
import {InvoiceComponent} from '../../invoice/invoice.component';
import {AdminSelectionComponent} from '../admin-selection/admin-selection.component';

@Component({
    selector: 'queue-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MainComponent implements OnInit {
    patientsdatasource = new MatTableDataSource<MergedPatient_QueueModel>();
    patientsheaders = ['FileNo', 'Photo', 'Name', 'ID', 'Age', 'Phone', 'Last Visit', 'Status'];
    dialogRef: MatDialogRef<any>;

    constructor(private queue: QueueService,
                public _matDialog: MatDialog,) {
        queue.mainpatientqueue.subscribe(value => {
            this.patientsdatasource.data = value;
        });
    }

    ngOnInit(): void {
    }

    showdialog(data: MergedPatient_QueueModel): void {
        if (data.queuedata.checkin.status === 0) {
            this.showadminchoice();
        } else {
            this.viewinvoice(data);
        }
    }

    showadminchoice(): void {
        this.dialogRef = this._matDialog.open(AdminSelectionComponent, {});

        this.dialogRef.afterClosed();
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
}
