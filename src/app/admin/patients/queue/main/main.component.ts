import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {QueueService} from '../../../services/queue.service';
import {MergedPatient_QueueModel} from '../../../../models/MergedPatient_Queue.model';
import {firestore} from 'firebase';
import * as moment from 'moment';

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

    constructor(private queue: QueueService) {
        queue.mainpatientqueue.subscribe(value => {
            this.patientsdatasource.data = value;
        });
    }

    ngOnInit(): void {
    }

    getAge(birtday: firestore.Timestamp): number {
        return moment().diff(birtday.toDate().toLocaleDateString(), 'years');
    }
}
