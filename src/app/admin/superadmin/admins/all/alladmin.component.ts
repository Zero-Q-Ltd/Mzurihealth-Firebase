import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {HospitalAdmin} from '../../../../models/HospitalAdmin';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {HospitalService} from '../../../services/hospital.service';
import {AdminService} from '../../../services/admin.service';
import {ProceduresService} from '../../../services/procedures.service';
import {LocalcommunicationService} from '../../procedures/localcommunication.service';
import {AdminInvite} from '../../../../models/AdminInvite';
import {AdminCategory} from '../../../../models/AdminCategory';

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
    userdata: HospitalAdmin;
    admincategories: Array<AdminCategory> = [];

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
        this.adminservice.observableuserdata.subscribe(value => {
            this.userdata = value;
        });
        this.adminservice.admincategories.subscribe(categories => {
            this.admincategories = categories;
        });
    }

    ngOnInit(): void {
    }

    categorytext(categoryid: string): string {
        if (this.admincategories.length > 0) {
            if (this.admincategories.find(cat => {
                return cat.id === categoryid;
            })) {
                return this.admincategories.find(cat => {
                    return cat.id === categoryid;
                }).name;
            } else {
                return 'Invalid';
            }
        } else {
            return 'loading...';
        }
    }

    cancelinvite(user: AdminInvite): void {
        this.adminservice.deleteinvite(user.id);
    }

    disableadmin(user: HospitalAdmin): void {
        this.adminservice.disableadmin(user.id);
    }

    enableadmin(user: HospitalAdmin): void {
        this.adminservice.enableadmin(user.id);
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
