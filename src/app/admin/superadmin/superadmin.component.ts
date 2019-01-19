import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../@fuse/animations';
import {MatTabChangeEvent} from '@angular/material';
import {FuseSidebarService} from '../../../@fuse/components/sidebar/sidebar.service';
import {LocalcommunicationService} from './procedures/localcommunication.service';
import {ProceduresService} from '../services/procedures.service';
import {AdminService} from '../services/admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './superadmin.component.html',
    styleUrls: ['./superadmin.component.scss'],
    animations: fuseAnimations
})
export class SuperadminComponent implements OnInit {
    activeside = false;
    activetabindex = 0;
    sidebarstatus = false;

    constructor(private _fuseSidebarService: FuseSidebarService,
                private  communication: LocalcommunicationService,
                private procedureservice: ProceduresService,
                private adminservice: AdminService) {
        communication.onprocedureselected.subscribe(selection => {
            if (selection.selectiontype) {
                this.sidebarstatus = true;
                // this._fuseSidebarService.getSidebar('procedureconfig-sidebar').toggleOpen()
            } else {
                this.sidebarstatus = false;
                // this._fuseSidebarService.getSidebar('procedureconfig-sidebar').toggleOpen()
            }

        });
    }

    ngOnInit(): void {
        /**
         * Clear the buffers on load
         */
        this.communication.resetall();
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.activeside = false;
        this.activetabindex = tabChangeEvent.index;
    };

    toggleactiveside(): void {
        this.activeside = !this.activeside;
        // this.procedureservice.syncprocedures();
        // this.adminservice.initusertypes();
    }

    /**
     * used to display the sidebar
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
