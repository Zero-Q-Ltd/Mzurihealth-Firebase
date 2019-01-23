import {Component, Input, OnInit} from '@angular/core';
import {emptypatient, Patient} from '../../../../../models/Patient';

@Component({
  selector: 'patient-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    @Input() patient: Patient = {...emptypatient};

  constructor() { }

  ngOnInit() {
  }

}
