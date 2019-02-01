import {Pipe, PipeTransform} from '@angular/core';
import {HospitalAdmin} from '../../models/HospitalAdmin';

@Pipe({
    name: 'adminName'
})
export class AdminNamePipe implements PipeTransform {

    transform(admins: Array<HospitalAdmin>, adminid: string): string {
        console.log(admins, adminid);
        if (admins.filter(admin => {
            return admin.id === adminid;
        }).length !== 0) {
            return admins.filter(admin => {
                return admin.id === adminid;
            })[0].data.displayName;
        } else {
            return '';
        }
    }

}
