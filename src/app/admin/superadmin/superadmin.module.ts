import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuperadminRoutingModule} from './superadmin-routing.module';
import {SuperadminComponent} from './superadmin.component';
import {SharedModule} from '../shared/shared.module';
import {HospconfigComponent} from './hospconfig/hospconfig.component';
import {AllComponent} from './procedures/all/all.component';
import {ProcedureconfigComponent} from './procedures/procedureconfig/procedureconfig.component';
import {AddComponent} from './procedures/add/add.component';
import {ProfileComponent} from './admins/profile/profile.component';
import {AlladminComponent} from './admins/all/alladmin.component';
import {AddadminComponent} from './admins/add/addadmin.component';

@NgModule({
    declarations: [
        SuperadminComponent,
        HospconfigComponent,

        // Since these components are loaded as tab items, it's neccessary to import them to the parent module
        AllComponent,
        ProcedureconfigComponent,
        AddComponent,
        ProfileComponent,
        AlladminComponent,
        AddadminComponent
    ],
    imports: [
        CommonModule,
        SuperadminRoutingModule,
        SharedModule,
    ]
})
export class SuperAdminModule {
}
