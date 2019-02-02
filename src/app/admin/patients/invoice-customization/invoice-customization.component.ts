import {Component, Input, OnInit} from '@angular/core';
import {QueueService} from '../../services/queue.service';
import {PatientvisitService} from '../../services/patientvisit.service';
import {emptymergedQueueModel, MergedPatient_QueueModel} from '../../../models/MergedPatient_Queue.model';

@Component({
    selector: 'app-invoice-payment',
    templateUrl: './invoice-customization.component.html',
    styleUrls: ['./invoice-customization.component.scss']
})
export class InvoiceCustomizationComponent implements OnInit {
    @Input() PatientID: string;
    patientdata: MergedPatient_QueueModel = {...emptymergedQueueModel};

    constructor(private queue: QueueService, private visitservice: PatientvisitService) {
        /**
         * Subscribe so that other admin changes are immediately reflected
         */
        queue.mainpatientqueue.subscribe(queuedata => {
            queuedata.filter(value => {
                if (value.patientdata.id === this.PatientID) {
                    this.patientdata = value;
                }
            });
        });
    }

    ngOnInit(): void {
    }

}
