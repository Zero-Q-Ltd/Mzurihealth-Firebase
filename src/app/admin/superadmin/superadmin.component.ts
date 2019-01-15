import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../@fuse/animations';
import {MatTabChangeEvent} from '@angular/material';
import {FuseSidebarService} from '../../../@fuse/components/sidebar/sidebar.service';
import {LocalcommunicationService} from './procedures/localcommunication.service';

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

    constructor(private _fuseSidebarService: FuseSidebarService, private  communication: LocalcommunicationService) {
        communication.selectedtype.subscribe(type => {
            if (type) {
                this.sidebarstatus = true;
            } else {
                this.sidebarstatus = false;
            }

        });
    }

    ngOnInit() {
        /**
         * Clear the buffers on load
         */
        this.communication.resetall();
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.activeside = false;
        this.activetabindex = tabChangeEvent.index;
    };

    toggleactiveside() {
        this.activeside = !this.activeside;
    }
}
