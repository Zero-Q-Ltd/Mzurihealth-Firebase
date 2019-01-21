import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main/main.component';
import {MineComponent} from './mine/mine.component';
import {CurrrentComponent} from './currrent/currrent.component';
import {QueueRoutingModule} from './queue-routing.module';
import {QueueComponent} from './queue.component';
import {AdminSharedModule} from '../../shared/admin-shared.module';

@NgModule({
    declarations: [MainComponent, MineComponent, CurrrentComponent, QueueComponent],
    imports: [
        CommonModule,
        QueueRoutingModule,
        AdminSharedModule
    ],
})
export class QueueModule {
}
