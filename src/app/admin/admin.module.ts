import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
// import { AdminLayoutComponent } from './adminlayout.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsersGuard} from './guards/users.guard';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LayoutModule} from './layout/layout.module';
import {SampleModule} from '../main/sample/sample.module';
import {AdminlayoutComponent} from './adminlayout.component';
import {DocumentationModule} from './documentation/documentation.module';
import {AuthenticationModule} from './authentication/authentication.module';
import {CalendarModule} from './calendar/calendar.module';
import {AdminSharedModule} from './shared/admin-shared.module';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import {AgmCoreModule, AgmMap} from '@agm/core';

@NgModule({
    imports: [
        CommonModule,

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

        AdminSharedModule,

    ],
    declarations: [
        DashboardComponent,
        AdminlayoutComponent,
        AdminprofileComponent,
    ],
    exports: [AdminSharedModule],
    entryComponents: [],
    providers: [UsersGuard]
})
export class AdminModule {
}
