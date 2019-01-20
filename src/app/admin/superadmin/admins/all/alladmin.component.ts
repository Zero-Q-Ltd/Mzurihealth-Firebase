import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {HospitalAdmin} from '../../../../models/HospitalAdmin';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {HospitalService} from '../../../services/hospital.service';
import {AdminService} from '../../../services/admin.service';
import {ProceduresService} from '../../../services/procedures.service';
import {LocalcommunicationService} from '../../procedures/localcommunication.service';
import {AdminInvite} from '../../../../models/AdminInvite';

@Component({
    selector: 'admins-all',
    templateUrl: './alladmin.component.html',
    styleUrls: ['./alladmin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AlladminComponent implements OnInit {
    adminheaders = ['image', 'Name', 'Email', 'Phone', 'Address', 'Level', 'Status', 'Action'];
    adminsdatasource = new MatTableDataSource<HospitalAdmin>();
    invitedadminsdatasource = new MatTableDataSource<AdminInvite>();
    selectedadmin: HospitalAdmin;

    constructor(private hospitalservice: HospitalService,
                private adminservice: AdminService,
                private procedureservice: ProceduresService,
                private communicationService: LocalcommunicationService) {
        this.hospitalservice.hospitaladmins.subscribe(admins => {
            this.adminsdatasource.data = admins;
        });
        this.hospitalservice.invitedadmins.subscribe(admins => {
            this.invitedadminsdatasource.data = admins;
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

    cancelinvite(): void {

    }

    ondeselect(): void {
        this.communicationService.resetall();
    }

    /**
     * On select
     *
     * @param selected
     */
    onSelect(selected: HospitalAdmin): void {
        this.selectedadmin = selected;
        this.communicationService.onadminselected.next(selected);
    }
}
