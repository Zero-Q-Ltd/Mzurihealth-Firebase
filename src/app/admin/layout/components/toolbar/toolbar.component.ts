import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';

import {FuseConfigService} from '@fuse/services/config.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';

import {navigation} from 'app/admin/navigation/navigation';
import {emptyhospital, Hospital} from '../../../../models/Hospital';
import {emptyadmin, HospitalAdmin} from '../../../../models/HospitalAdmin';
import {AdminService} from '../../../services/admin.service';
import {HospitalService} from '../../../services/hospital.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];

    previousUrl: string;
    url: string;
    authstate: boolean;
    activehospital: Hospital = Object.assign({}, emptyhospital);
    userdata: HospitalAdmin = Object.assign({}, emptyadmin);

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     * @param adminservice
     * @param hospitalservice
     * @param afAuth
     * @param router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private adminservice: AdminService,
        private hospitalservice: HospitalService,
        private afAuth: AngularFireAuth,
        private router: Router,
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'sw',
                title: 'Swahili',
                flag : 'ke'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        /**
         * custom code
         */
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.id) {
                this.userdata = admin;
            }
        });
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
            }
        });
    }

    onLogoutClick() {
        this.afAuth.auth.signOut().then(result => {
            // console.log(result)
            this.router.navigateByUrl('');
        });
    }

    setuserstatus(status) {
        this.adminservice.setstatus(status);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {'id': this._translateService.currentLang});
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }
    logout() : void{
        this.adminservice.logout();
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
}
