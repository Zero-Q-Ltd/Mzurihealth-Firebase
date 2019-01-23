import {Component, Input, OnInit} from '@angular/core';
import {emptypatient, Patient} from '../../../../../models/Patient';

@Component({
  selector: 'patient-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
    @Input() patient: Patient = {...emptypatient};

  constructor() { }

  ngOnInit() {
  }

}
