import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {QueueService} from '../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../models/MergedPatient_Queue.model';

@Component({
    selector: 'queue-mine',
    templateUrl: './mine.component.html',
    styleUrls: ['./mine.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MineComponent implements OnInit {
    patientsdatasource = new MatTableDataSource<MergedPatient_QueueModel>();
    patientsheaders = ['FileNo', 'Photo', 'Name', 'ID', 'Age', 'Phone', 'Last Visit', 'Status'];

    constructor(private queue: QueueService) {
        queue.mainpatientqueue.subscribe(value => {
            this.patientsdatasource.data = value;
        });
    }

    ngOnInit(): void {
    }

}
