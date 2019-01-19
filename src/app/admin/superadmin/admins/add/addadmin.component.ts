import {Component, OnInit} from '@angular/core';
import {emptyadmin, HospitalAdmin} from '../../../../models/HospitalAdmin';
import {HospitalService} from '../../../services/hospital.service';
import {AdminService} from '../../../services/admin.service';
import {ProceduresService} from '../../../services/procedures.service';

@Component({
    selector: 'admin-add',
    templateUrl: './addadmin.component.html',
    styleUrls: ['./addadmin.component.scss']
})
export class AddadminComponent implements OnInit {
    tempuser: HospitalAdmin = emptyadmin;

    constructor( private hospitalservice: HospitalService,
                 private adminservice: AdminService,
                 private procedureservice: ProceduresService) {
    }

    ngOnInit() {
    }

    sendinvite() {
        // this.tempuser = this.firestore.emptyuser
        console.log(this.tempuser);
        // console.log(emptyuser.data.displayName)
        if (this.nameControl.valid && this.emailControl.valid && this.phoneControl.valid && this.tempuser.config.level > 0) {
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
