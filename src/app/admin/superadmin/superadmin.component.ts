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
    /**
     * which sidebar to display, or none
     */
    sidebarstatus = 0;

    constructor(private _fuseSidebarService: FuseSidebarService,
                private  communication: LocalcommunicationService,
                private procedureservice: ProceduresService,
                private adminservice: AdminService) {
        /**
         * toggle the sidebar when aither an admin or a procedure is selected
         * Each one has a different child component attached
         */
        communication.onprocedureselected.subscribe(selection => {
            if (selection.selectiontype) {
                this.sidebarstatus = 1;
                // this._fuseSidebarService.getSidebar('procedureconfig-sidebar').toggleOpen()
            } else {
                this.sidebarstatus = 0;
                // this._fuseSidebarService.getSidebar('procedureconfig-sidebar').toggleOpen()
            }
        });
        communication.onadminselected.subscribe(admin => {
            if (admin.id) {
                this.sidebarstatus = 2;
            } else {
                this.sidebarstatus = 0;
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
