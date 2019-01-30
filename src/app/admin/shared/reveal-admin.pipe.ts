import {Pipe, PipeTransform} from '@angular/core';
import {HospitalAdmin} from '../../models/HospitalAdmin';

@Pipe({
    name: 'adminName'
})
export class AdminNamePipe implements PipeTransform {

    transform(adminid: string, admins: Array<HospitalAdmin>): string {
        let name = '';
        admins.forEach(admin => {
            name = admin.id === adminid ? admin.data.displayName : '';
            console.log(name);

        });

        return name;
    }

}
