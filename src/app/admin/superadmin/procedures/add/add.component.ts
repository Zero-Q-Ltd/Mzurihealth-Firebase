import {Component, OnInit, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProceduresService} from '../../../services/procedures.service';
import {ProcedureCategory} from '../../../../models/ProcedureCategory';
import {emptyprawrocedure, rawprocedurecategory, RawProcedure} from '../../../../models/RawProcedure';
import {InsuranceCompany} from '../../../../models/InsuranceCompany';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FuseSidebarService} from '../../../../../@fuse/components/sidebar/sidebar.service';
import {LocalcommunicationService} from '../localcommunication.service';

@Component({
    selector: 'procedure-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    animations: [fuseAnimations]
})
export class AddComponent implements OnInit {
    proceduresform: FormGroup;
    procedurecategories: Array<ProcedureCategory> = [];
    loadingprocedures = false;
    insuranceprices: {
        [key: string]: number
    };
    expandedlist = 0;
    customprice = false;
    selectedprocedure: RawProcedure = {...emptyprawrocedure};
    procedurefilterFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    procedureheaders = ['name', 'category'];
    categoryprocedures = new MatTableDataSource<RawProcedure>();
    expandedElement: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private _formBuilder: FormBuilder,
                private _fuseSidebarService: FuseSidebarService,
                private procedureservice: ProceduresService,
                private communicatioservice: LocalcommunicationService) {
        procedureservice.procedurecategories.subscribe(categories => {
            this.procedurecategories = categories;
        });
    }

    ngOnInit() {
        this.proceduresform = this._formBuilder.group({
            category: ['', Validators.required],
            minprice: [{
                value: '0',
                disabled: true
            }, Validators.required],
            maxprice: [{
                value: '0',
                disabled: true
            }, Validators.required],
            baseprice: ['', Validators.required],
            // customprice: [{
            //     value: false,
            //     disabled: false,
            // }, Validators.required]
        });
        this.proceduresform.get('category').valueChanges.subscribe((category: ProcedureCategory) => {
            this.loadingprocedures = true;
            this.procedureservice.fetchproceduresincategory(category.id).get().then(rawprocedures => {
                this.categoryprocedures.data = rawprocedures.docs.map(rawcat => {
                    const cat = rawcat.data() as RawProcedure;
                    cat.id = rawcat.id;
                    return cat;
                });
                console.log(this.categoryprocedures);
                this.loadingprocedures = false;
            });
        });
    }

    applyFilter(filterValue: string) {
        this.categoryprocedures.filter = filterValue.trim().toLowerCase();
    }

    ngAfterViewInit() {
        this.categoryprocedures.paginator = this.paginator;
        this.categoryprocedures.sort = this.sort;
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
    onSelect(selected): void {
        this.selectedprocedure = selected;
        this.communicatioservice.onProcedureselected.next(selected);
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    setexpanded(id: number) {
        this.expandedlist = id;
    }


    setunsuranceprice(insurance: InsuranceCompany, value) {
        console.log(value, insurance);
    }

}
