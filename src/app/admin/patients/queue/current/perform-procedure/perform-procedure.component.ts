import {Component, Inject, OnInit} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MergedProcedureModel} from '../../../../../models/MergedProcedure.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {ProceduresService} from '../../../../services/procedures.service';
import {emptyprocedureperformed, Procedureperformed} from '../../../../../models/Procedureperformed';

@Component({
    selector: 'app-perform-procedure',
    templateUrl: './perform-procedure.component.html',
    styleUrls: ['./perform-procedure.component.scss']
})
export class PerformProcedureComponent implements OnInit {
    displayedColumns: string[] = ['select', 'name', 'results', 'notes'];
    proceduresdataSource = new MatTableDataSource<MergedProcedureModel>([]);
    selection = new SelectionModel<MergedProcedureModel>(true, []);
    procedureResults: Array<Procedureperformed> = [];


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.proceduresdataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.proceduresdataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: MergedProcedureModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
    }

    constructor(public dialogRef: MatDialogRef<PerformProcedureComponent>,
                private procedureservice: ProceduresService,) {
        /**
         *TODO: Here I've had to device a temporary hack that should be fixed
         * Iterate through the procedures and create resulst for all of them, so that the html renders without errors
         */
        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            mergedprocedures.forEach((r, i) => {
                this.procedureResults[i] = {...emptyprocedureperformed};
                /**
                 * very useful for later on when dialog is dismissed
                 */
                this.procedureResults[i].originalprocedureid = r.rawprocedure.id;
                this.procedureResults[i].customprocedureid = r.customprocedure.id;
            });
            this.proceduresdataSource.data = mergedprocedures;

        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

}
