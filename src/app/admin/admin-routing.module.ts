import {RouterModule, Routes} from '@angular/router';
import {UsersGuard} from './guards/users.guard';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
// import {AppointmentComponent} from './appointment/appointment.component';
// import { AdminLayoutComponent } from './adminlayout.component';
import {SuperadminComponent} from './superadmin/superadmin.component';
import {AdminlayoutComponent} from './adminlayout.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [UsersGuard],
        component: AdminlayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                // canActivate: [UsersGuard],
                component: DashboardComponent
            },
            {
                path: 'appointments',
                // canActivate: [UsersGuard],
                // component: AppointmentComponent
                loadChildren: 'app/admin/calendar/calendar.module#CalendarModule'
            },
            {
                path: 'patients',
                // canActivate: [UsersGuard],
                loadChildren: 'app/admin/patients/patients.module#PatientsModule'
            },
            {
                path: 'documentation',
                loadChildren: 'app/admin/documentation/documentation.module#DocumentationModule'
            },
            // {
            //     path: 'payments',
            //     canActivate: [UsersGuard],
            //     loadChildren: 'app/superadmin/payments/payments.module#PaymentsModule'
            // },
            {
                path: 'superadmin',
                // canActivate: [UsersGuard],
                loadChildren: 'app/admin/superadmin/superadmin.module#SuperAdminModule'
            },
            {
                path: 'knowledge-base',
                loadChildren: 'app/admin/knowledge-base/knowledge-base.module#KnowledgeBaseModule'
                // component: DashboardComponent
            },
            {
                path: '',
                // canActivate: [UsersGuard],
                component: DashboardComponent
            },
        ]
    },
    {
      path: 'authentication',
      loadChildren: 'app/admin/authentication/authentication.module#AuthenticationModule'
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule {
}
