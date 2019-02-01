import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AllComponent} from './all/all.component';
import {AddComponent} from './add/add.component';
import {PatientsRoutingModule} from './patients-routing.module';
import {AdminSharedModule} from '../shared/admin-shared.module';
import {InvoiceComponent} from './invoice/invoice.component';
import {ProfileComponent} from './profile/profile.component';
import {PushqueueComponent} from './pushqueue/pushqueue.component';
import { InvoicePaymentComponent } from './invoice-payment/invoice-payment.component';

@NgModule({
    declarations: [AllComponent, AddComponent, InvoiceComponent, ProfileComponent, PushqueueComponent, InvoicePaymentComponent],
    imports: [
        CommonModule,
        PatientsRoutingModule,
        AdminSharedModule,
    ],
    entryComponents: [AddComponent, PushqueueComponent, InvoiceComponent],

})
export class PatientsModule {
}
