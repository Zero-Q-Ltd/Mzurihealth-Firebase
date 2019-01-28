import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {QueueService} from '../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../models/MergedPatient_Queue.model';
import * as moment from 'moment';
import {firestore} from 'firebase';

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
        queue.mypatientqueue.subscribe(value => {
            this.patientsdatasource.data = value;
        });
    }

    ngOnInit(): void {
    }

    getAge(birtday: firestore.Timestamp): number {
        return moment().diff(birtday.toDate().toLocaleDateString(), 'years');
    }

}
