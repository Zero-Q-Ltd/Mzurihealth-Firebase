import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AllComponent} from './all/all.component';
import {AddComponent} from './add/add.component';
import {PatientsRoutingModule} from './patients-routing.module';
import {AdminSharedModule} from '../shared/admin-shared.module';
import {ProfileComponent} from './profile/profile.component';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
    declarations: [AllComponent, AddComponent, ProfileComponent, InvoiceComponent],
    imports: [
        CommonModule,
        PatientsRoutingModule,
        AdminSharedModule,

    ],
    entryComponents: [AddComponent],

})
export class PatientsModule {
}
