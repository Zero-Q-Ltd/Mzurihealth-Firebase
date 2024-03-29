import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule, MatSnackBarModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import 'hammerjs';
import {FuseModule} from '@fuse/fuse.module';
import {FuseProgressBarModule} from '@fuse/components';

import {fuseConfig} from 'app/fuse-config';

import {AppComponent} from 'app/app.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {RouterModule} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {FuseSharedModule} from '../@fuse/shared.module';
import {Error404Module} from './errorpages/404/error-404.module';
import {Error500Module} from './errorpages/500/error-500.module';
import {FrontendModule} from './frontend/frontend.module';
import {AgmCoreModule} from '@agm/core';
import {CommonModule} from '@angular/common';
import {NotificationComponent} from './shared/components/notification/notification.component';

export const firebaseConfig = {
    apiKey: 'AIzaSyDaiEsgWOaeopaYQTgTWPIatMeKLZjZc-A',
    authDomain: 'mzurihealth.firebaseapp.com',
    databaseURL: 'https://mzurihealth.firebaseio.com',
    projectId: 'mzurihealth',
    storageBucket: 'mzurihealth.appspot.com',
    messagingSenderId: '126269493100'
};

@NgModule({
    declarations: [
        AppComponent,
        NotificationComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBLs7FSznETgYbDW0E3tR26lKFBzE43iaQ'
        }),
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseProgressBarModule,
        MatIconModule,
        TranslateModule.forRoot(),
        AppRoutingModule,
        RouterModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFirestoreModule.enablePersistence({
            experimentalTabSynchronization: true
        }),
        MatSnackBarModule,
        Error404Module,
        Error500Module,
        FrontendModule,
    ],
    entryComponents: [NotificationComponent],
    providers: [AngularFireAuth],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
}
