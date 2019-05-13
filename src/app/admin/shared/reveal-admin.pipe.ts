import {Pipe, PipeTransform} from '@angular/core';
import {HospitalAdmin} from '../../models/user/HospitalAdmin';

@Pipe({
    name: 'adminName'
})
export class AdminNamePipe implements PipeTransform {
    /**
     * get the admin corresponding to the id provided
     * @param admins
     * @param adminid
     */
    transform(admins: Array<HospitalAdmin>, adminid: string): string {
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
