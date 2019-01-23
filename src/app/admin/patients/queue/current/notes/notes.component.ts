import {Component, Input, OnInit} from '@angular/core';
import {emptypatient, Patient} from '../../../../../models/Patient';

@Component({
  selector: 'patient-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
    @Input() patient: Patient = {...emptypatient};

  constructor() { }

  ngOnInit() {
  }

}
