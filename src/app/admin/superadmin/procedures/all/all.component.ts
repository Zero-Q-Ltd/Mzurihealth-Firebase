import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RawProcedure, rawprocedurecategory} from '../../../../models/RawProcedure';
import {ProceduresService} from '../../../services/procedures.service';
import {CustomProcedure, emptycustomprocedure} from '../../../../models/CustomProcedure';
import {ProcedureCategory} from '../../../../models/ProcedureCategory';
import {LocalcommunicationService} from '../localcommunication.service';
import {fuseAnimations} from '../../../../../@fuse/animations';

@Component({
    selector: 'procedures-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    animations: [fuseAnimations]
})
export class AllComponent implements OnInit, AfterViewInit {
    hospitalprocedures = new MatTableDataSource<{ rawprocedure: RawProcedure, customprocedure: CustomProcedure }>();
    procedurecategories: Array<ProcedureCategory>;
    procedureheaders = ['name', 'category', 'regprice'];
    selectedprocedure: CustomProcedure = {...emptycustomprocedure};
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private procedureservice: ProceduresService,
                private communicatioservice: LocalcommunicationService) {
        procedureservice.hospitalprocedures.subscribe(mergedprocedures => {
            this.hospitalprocedures.data = mergedprocedures;
        });
        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.hospitalprocedures.paginator = this.paginator;
        this.hospitalprocedures.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.hospitalprocedures.filter = filterValue.trim().toLowerCase();
    }

    getcategory(category: rawprocedurecategory) {
        if (category.subcategoryid) {
            return this.procedurecategories.find(cat => {
                return cat.id === category.id;
            }).subcategories[category.subcategoryid].name;
        } else {
            return '';
        }
    }

    /**
     * On select
     *
     * @param selected
     */
    onSelect(selected: { rawprocedure: RawProcedure, customprocedure: CustomProcedure }): void {
        this.selectedprocedure = selected.customprocedure;
        this.communicatioservice.onprocedureselected.next({selectiontype: 'customprocedure', selection: selected});
    }

}
