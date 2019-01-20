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

    categoryarray(): Array<string> {
        const categoryid = this.clickedadmin.config.categoryid;
        const subcategory = this.clickedadmin.config.level;
        if (this.admincategories.length > 0) {
            if (this.admincategories.find(cat => {
                return cat.id === categoryid;
            })) {
                const admincategory = this.admincategories.find(cat => {
                    return cat.id === categoryid;
                });
                const adinsubcategory = admincategory.subcategories[subcategory].name;
                return [admincategory.name, adinsubcategory];
            } else {
                return ['Invalid'];
            }
        } else {
            return ['loading...'];
        }
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
