import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {AdminService} from '../services/admin.service';

@Injectable()
export class UsersGuard implements CanActivate {
    constructor(private adminservice: AdminService, private router: Router) {

    }

    canActivate(active: ActivatedRouteSnapshot, activated: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // console.log(active, activated)
        return this.adminservice.observableuserdata
            .map(userdata => {
                // console.log(userdata)
                if (userdata && userdata.hasOwnProperty('data')) {
                    if (activated.url === '/app/dashboard') {
                        return false;
                    } else {
                        return true;
                    }

                } else {
                    this.router.navigate(['admin/authentication/signin']);
                    return false;
                }
            });
        // return true;

    }
}
