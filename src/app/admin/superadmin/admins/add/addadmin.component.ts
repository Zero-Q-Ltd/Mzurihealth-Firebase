import {Component, OnInit} from '@angular/core';
import {emptyadmin, HospitalAdmin} from '../../../../models/HospitalAdmin';
import {HospitalService} from '../../../services/hospital.service';
import {AdminService} from '../../../services/admin.service';
import {ProceduresService} from '../../../services/procedures.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notifications.service';
import {AdminCategory} from '../../../../models/AdminCategory';

@Component({
    selector: 'admin-add',
    templateUrl: './addadmin.component.html',
    styleUrls: ['./addadmin.component.scss']
})
export class AddadminComponent implements OnInit {
    tempuser: HospitalAdmin = emptyadmin;
    adminsform: FormGroup;
    admincategories: Array<AdminCategory> = [];

    constructor(private hospitalservice: HospitalService,
                private adminservice: AdminService,
                private _formBuilder: FormBuilder,
                private procedureservice: ProceduresService,
                private notificationservice: NotificationService) {
        this.adminservice.admincategories.subscribe(categories => {
            this.admincategories = categories;
        });
    }

    ngOnInit(): void {
        this.adminsform = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required, Validators.email],
            phone: ['', Validators.required],
            role: ['', Validators.required]
        });
    }

    sendinvite(): void {
        console.log(this.tempuser);
        if (this.adminsform.valid) {
            this.tempuser;
            console.log(this.tempuser);
            this.tempuser.config.hospitalid = this.hospitalservice.activehospital.value.id;

            this.adminservice.createinvite(this.tempuser).then(result => {
                this.notificationservice.notify({
                    alert_type: 'success',
                    body: 'Successfully sent invite',
                    placement: 'center',
                    duration: 3000,
                    title: 'Success',
                });
                this.tempuser = emptyadmin;
            });
        } else {
            this.notificationservice.notify({
                alert_type: 'warning',
                body: 'Please fill all the fields',
                placement: 'center',
                duration: 3000,
                title: 'Error',
            });
        }
    }

}
