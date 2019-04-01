import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main/main.component';
import {MineComponent} from './mine/mine.component';
import {QueueRoutingModule} from './queue-routing.module';
import {QueueComponent} from './queue.component';
import {AdminSharedModule} from '../../shared/admin-shared.module';
import {NotesComponent} from './current/notes/notes.component';
import {HistoryComponent} from './current/history/history.component';
import {TodayComponent} from './current/today/today.component';
import {CurrentComponent} from './current/current.component';
import {SidebarComponent} from './current/sidebar/sidebar.component';
import {GeneralDetailsComponent} from './current/generaldetails/general-details.component';
import {FuseSharedModule} from '../../../../@fuse/shared.module';
import {FuseWidgetModule} from '../../../../@fuse/components';
import {AdminSelectionComponent} from './admin-selection/admin-selection.component';
import {PerformProcedureComponent} from './current/perform-procedure/perform-procedure.component';

@NgModule({
    declarations: [MainComponent,
        MineComponent,
        QueueComponent,
        GeneralDetailsComponent,
        NotesComponent,
        HistoryComponent,
        TodayComponent,
        CurrentComponent,
        SidebarComponent,
        AdminSelectionComponent,
        PerformProcedureComponent],
    imports: [
        CommonModule,
        QueueRoutingModule,
        AdminSharedModule,
        FuseSharedModule,
        FuseWidgetModule
    ],
    entryComponents: [AdminSelectionComponent, PerformProcedureComponent]
})
export class QueueModule {
}
