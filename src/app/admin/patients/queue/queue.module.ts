import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main/main.component';
import {MineComponent} from './mine/mine.component';
import {QueueRoutingModule} from './queue-routing.module';
import {QueueComponent} from './queue.component';
import {AdminSharedModule} from '../../shared/admin-shared.module';
import {ProfileComponent} from './current/profile/profile.component';
import {NotesComponent} from './current/notes/notes.component';
import {HistoryComponent} from './current/history/history.component';
import {TodayComponent} from './current/today/today.component';
import {CurrentComponent} from './current/current.component';

@NgModule({
    declarations: [MainComponent, MineComponent, QueueComponent, ProfileComponent, NotesComponent, HistoryComponent, TodayComponent, CurrentComponent],
    imports: [
        CommonModule,
        QueueRoutingModule,
        AdminSharedModule
    ],
})
export class QueueModule {
}
