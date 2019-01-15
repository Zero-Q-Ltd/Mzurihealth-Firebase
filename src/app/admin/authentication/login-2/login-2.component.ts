import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {FuseSplashScreenService} from '../../../../@fuse/services/splash-screen.service';
import {AdminService} from '../../services/admin.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {HospitalAdmin} from '../../../models/HospitalAdmin';
import {Router} from '@angular/router';

@Component({
    selector: 'login-2',
    templateUrl: './login-2.component.html',
    styleUrls: ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Login2Component implements OnInit {
    loginForm: FormGroup;
    loading = false;
    infofield: string = null;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param _fuseSplashScreenService
     * @param adminservice
     * @param afAuth
     * @param router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private adminservice: AdminService,
        private afAuth: AngularFireAuth,
        private router: Router,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this.adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.id) {
                this.router.navigate(['/admin']);
            }
        });
    }

    loginWithGoogle() {
        this.loading = true;
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(userData => {
            this.loading = false;
            this.infofield = null;
            if (userData) {

            }
            console.log(userData);
        }, err => {
            this.loading = false;
            console.log(err);
            if (err.code === 'auth/popup-closed-by-user') {
                this.infofield = 'Please Authorise MzuriHealth to Access your Google Account';
            } else {
                this.infofield = err.message;
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
}
