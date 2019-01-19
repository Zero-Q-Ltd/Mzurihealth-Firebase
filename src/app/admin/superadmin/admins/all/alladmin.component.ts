import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {HospitalAdmin} from '../../../../models/HospitalAdmin';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {HospitalService} from '../../../services/hospital.service';
import {AdminService} from '../../../services/admin.service';
import {ProceduresService} from '../../../services/procedures.service';

@Component({
    selector: 'admins-all',
    templateUrl: './alladmin.component.html',
    styleUrls: ['./alladmin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AlladminComponent implements OnInit {
    adminheaders = ['Photo', 'Name', 'Email', 'Phone', 'Address', 'Level', 'Status', 'Action'];
    adminsdatasource = new MatTableDataSource<HospitalAdmin>();

    constructor(private hospitalservice: HospitalService,
                private adminservice: AdminService,
                private procedureservice: ProceduresService) {
        this.hospitalservice.hospitaladmins.subscribe(admins => {
            this.adminsdatasource.data = admins;
        });
    }

    ngOnInit(): void {
    }

    leveltext(level): string {
        level = Number(level);
        switch (level) {
            case 0:
                return 'System Admin';

            case 1:
                return 'Doctor';

            case 2:
                return 'Nurse';

            case 3:
                return 'Receptionist';

        }
    }
}
