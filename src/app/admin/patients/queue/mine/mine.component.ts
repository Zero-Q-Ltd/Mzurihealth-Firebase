import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Patient} from '../../../../models/Patient';
import {fuseAnimations} from '../../../../../@fuse/animations';

@Component({
  selector: 'queue-mine',
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MineComponent implements OnInit {
    patientsdatasource = new MatTableDataSource<Patient>();
    patientsheaders = ['FileNo', 'Photo', 'Name', 'ID', 'Age', 'Phone', 'Last Visit', 'Status'];
  constructor() { }

  ngOnInit() {
  }

}
