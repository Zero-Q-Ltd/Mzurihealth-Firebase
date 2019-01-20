import {Component, OnInit} from '@angular/core';
import {LocalcommunicationService} from '../../procedures/localcommunication.service';
import {AdminService} from '../../../services/admin.service';
import {NotificationService} from '../../../../shared/services/notifications.service';
import {HospitalAdmin} from '../../../../models/HospitalAdmin';
import {AdminCategory} from '../../../../models/AdminCategory';

@Component({
    selector: 'admins-adminconfig',
    templateUrl: './adminconfig.component.html',
    styleUrls: ['./adminconfig.component.scss']
})
export class AdminconfigComponent implements OnInit {
    clickedadmin: HospitalAdmin;
    admincategories: Array<AdminCategory> = [];

    constructor(private communicationservice: LocalcommunicationService,
                private adminService: AdminService,
                private notificationservice: NotificationService) {
        this.communicationservice.onadminselected.subscribe(admin => {
            this.clickedadmin = admin;
        });
        this.adminService.admincategories.subscribe(categories => {
            this.admincategories = categories;
        });
    }

    ngOnInit(): void {
    }

    clearselection(): void {
        this.communicationservice.resetall();
    }

    saveprocedureconfig(): void {
        if (!null) {

        } else {
            this.notificationservice.notify({
                placement: 'centre',
                title: 'Error',
                alert_type: 'error',
                body: 'Regular price is required'
            });
        }
    }
}
