import {Component, OnInit} from '@angular/core';
import {HospitalService} from '../../../services/hospital.service';
import {AdminService} from '../../../services/admin.service';
import {ProceduresService} from '../../../services/procedures.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notifications.service';
import {AdminCategory, Adminsubcategory, emptyadminCategory} from '../../../../models/AdminCategory';
import {AdminInvite, emptyadmininvite} from '../../../../models/AdminInvite';
import {HospitalAdmin} from '../../../../models/HospitalAdmin';

@Component({
    selector: 'admin-add',
    templateUrl: './addadmin.component.html',
    styleUrls: ['./addadmin.component.scss']
})
export class AddadminComponent implements OnInit {
    admininvite: AdminInvite = emptyadmininvite;
    adminsform: FormGroup;
    admincategories: Array<AdminCategory> = [];
    chosencategory: AdminCategory = {...emptyadminCategory};
    userdata: HospitalAdmin;

    constructor(private hospitalservice: HospitalService,
                private adminservice: AdminService,
                private _formBuilder: FormBuilder,
                private procedureservice: ProceduresService,
                private notificationservice: NotificationService) {
        this.adminservice.admincategories.subscribe(categories => {
            this.admincategories = categories;
        });
        this.adminservice.observableuserdata.subscribe(value => {
            this.userdata = value;
        });
    }

    initform(): void {
        this.adminsform = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            role: ['', Validators.required],
            level: [{
                value: '',
                disabled: true
            }, Validators.required]
        });
    }

    ngOnInit(): void {
        this.initform();
        this.adminsform.get('role').valueChanges.subscribe(role => {
            if (!role) {
                return;
            }
            this.adminsform.get('level').enable();
            this.chosencategory = role;
        });
    }

    sendinvite(): void {
        if (this.adminsform.valid) {
            /**
             * did this just to take advantage of linting
             */
            const leveldata = this.adminsform.get('level').value as { key: string, value: Adminsubcategory };
            this.admininvite.name = this.adminsform.get('name').value;
            this.admininvite.email = this.adminsform.get('email').value;
            this.admininvite.phone = this.adminsform.get('phone').value;

            this.admininvite.categoyid = this.chosencategory.id;
            this.admininvite.level = Number(leveldata.key);
            this.admininvite.hospitalid = this.hospitalservice.activehospital.value.id;
            this.admininvite.inviterid = this.userdata.id;

            console.log(this.admininvite);
            if (!this.hospitalservice.adminexists(this.admininvite.email)) {
                this.adminservice.createinvite(this.admininvite).then(result => {
                    this.notificationservice.notify({
                        alert_type: 'success',
                        body: 'Successfully sent invite',
                        placement: {
                            vertical: 'bottom',
                            horizontal: 'center'
                        },
                        duration: 3000,
                        title: 'Success',
                    });
                    this.adminsform.reset({level: {value: '', disabled: true}}, {emitEvent: false});
                });
            } else {
                this.adminservice.createinvite(this.admininvite).then(result => {
                    this.notificationservice.notify({
                        alert_type: 'error',
                        body: 'A user with this email already exists',
                        placement: {
                            vertical: 'bottom',
                            horizontal: 'center'
                        },
                        duration: 3000,
                        title: 'Error!',
                    });
                });
            }

        } else {
            this.notificationservice.notify({
                alert_type: 'warning',
                body: 'Please fill all the fields',
                placement: {
                    vertical: 'bottom',
                    horizontal: 'center'
                },
                duration: 3000,
                title: 'Error',
            });
        }
    }

}
