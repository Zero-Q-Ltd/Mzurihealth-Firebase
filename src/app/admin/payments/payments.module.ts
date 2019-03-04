import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentsRoutingModule} from './payments-routing.module';
import {AllComponent} from './all/all.component';
import {AdminSharedModule} from '../shared/admin-shared.module';

@NgModule({
    declarations: [AllComponent],
    imports: [
        AdminSharedModule,
        CommonModule,
        PaymentsRoutingModule
    ]
})
export class PaymentsModule {
}
