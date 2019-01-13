import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
// import { AdminLayoutComponent } from './adminlayout.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsersGuard} from './guards/users.guard';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LayoutModule} from './layout/layout.module';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {FuseConfirmDialogModule, FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '../../@fuse/components';
import {FuseSharedModule} from '../../@fuse/shared.module';
import {SampleModule} from '../main/sample/sample.module';
import {AdminlayoutComponent} from './adminlayout.component';
import {DocumentationModule} from './documentation/documentation.module';
import {AuthenticationModule} from './authentication/authentication.module';
import {CalendarModule} from './calendar/calendar.module';
import {SharedModule} from './shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        // Material moment date module
        MatMomentDateModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        // Fuse modules
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        // App modules
        LayoutModule,

        // App modules
        SampleModule,

        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        AdminRoutingModule,
        LayoutModule,
        DocumentationModule,
        AuthenticationModule,
        CalendarModule,

        SharedModule
    ],
    declarations: [
        DashboardComponent,
        AdminlayoutComponent,
    ],
    exports: [SharedModule],
    entryComponents: [],
    providers: [UsersGuard]
})
export class AdminModule {
}
