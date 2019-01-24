import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RawProcedure, rawprocedurecategory} from '../../../../models/RawProcedure';
import {ProceduresService} from '../../../services/procedures.service';
import {CustomProcedure, emptycustomprocedure} from '../../../../models/CustomProcedure';
import {ProcedureCategory} from '../../../../models/ProcedureCategory';
import {LocalcommunicationService} from '../../localcommunication.service';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {FuseConfirmDialogComponent} from '../../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {NotificationService} from '../../../../shared/services/notifications.service';

@Component({
    selector: 'procedures-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    animations: [fuseAnimations]
})
export class AllComponent implements OnInit, AfterViewInit {
    hospitalprocedures = new MatTableDataSource<{ rawprocedure: RawProcedure, customprocedure: CustomProcedure }>();
    procedurecategories: Array<ProcedureCategory>;
    procedureheaders = ['name', 'category', 'regprice', 'minprice', 'maxprice', 'action'];
    selectedprocedure: CustomProcedure = {...emptycustomprocedure};
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private procedureservice: ProceduresService,
                private communicationservice: LocalcommunicationService,
                private _matDialog: MatDialog,
                private notificationservice: NotificationService) {
        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures.data = mergedprocedures;
        });
        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.hospitalprocedures.paginator = this.paginator;
        this.hospitalprocedures.sort = this.sort;
    }

    applyFilter(filterValue: string): void {
        this.hospitalprocedures.filter = filterValue.trim().toLowerCase();
    }

    getcategory(category: rawprocedurecategory): string {
        if (category.subcategoryid) {
            return this.procedurecategories.find(cat => {
                return cat.id === category.id;
            }).subcategories[category.subcategoryid].name;
        } else {
            return '';
        }
    }

    disableeprocedure(event, procedure: CustomProcedure): void {
        event.stopPropagation();
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable this procedure?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.procedureservice.disableprocedure(procedure.id).then(() => {
                    this.communicationservice.resetall();

                    this.notificationservice.notify({
                        placement: 'centre',
                        title: 'Success',
                        alert_type: 'success',
                        body: 'Deleted'
                    });
                });
            }
        });

    }

    /**
     * On select
     *
     * @param selected
     */
    onSelect(selected: { rawprocedure: RawProcedure, customprocedure: CustomProcedure }): void {
        this.selectedprocedure = selected.customprocedure;
        this.communicationservice.onprocedureselected.next({selectiontype: 'customprocedure', selection: selected});
    }

}
