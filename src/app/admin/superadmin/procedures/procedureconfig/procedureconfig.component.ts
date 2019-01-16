import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {LocalcommunicationService} from '../localcommunication.service';
import {emptyprawrocedure, RawProcedure} from '../../../../models/RawProcedure';
import {InsuranceService} from '../../../services/insurance.service';
import {InsuranceCompany} from '../../../../models/InsuranceCompany';
import {CustomProcedure, emptycustomprocedure} from '../../../../models/CustomProcedure';
import {ProceduresService} from '../../../services/procedures.service';

@Component({
    selector: 'app-procedureconfig',
    templateUrl: './procedureconfig.component.html',
    styleUrls: ['./procedureconfig.component.scss'],
    animations: fuseAnimations

})
export class ProcedureconfigComponent implements OnInit {
    selectedprocedure: RawProcedure = {...emptyprawrocedure};
    allinsurance: Array<InsuranceCompany> = [];
    filteredinsurance: Array<InsuranceCompany> = [];
    custominsuranceprice = false;
    customconfig: CustomProcedure = {...emptycustomprocedure};

    constructor(private communicatioservice: LocalcommunicationService,
                private insuranceservice: InsuranceService,
                private procedureservice: ProceduresService) {
        this.communicatioservice.onProcedureselected.subscribe(procedure => {
            this.selectedprocedure = procedure;
        });
        this.insuranceservice.allinsurance.subscribe(insurance => {
            this.allinsurance = insurance;
        });
    }

    ngOnInit() {
    }

    filterinsurance(filterValue: string) {
        if (filterValue) {
            let temp = [];
            filterValue = filterValue.trim(); // Remove whitespace
            filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
            this.insuranceservice.allinsurance.value.filter(data => {
                if (data['name'].toLowerCase().indexOf(filterValue) > -1) {
                    temp.push(data);
                }
            });
            this.filteredinsurance = temp;
        }
    }

    saveprocedureconfig() {
        this.customconfig.parentprocedureid = this.selectedprocedure.id;
        this.procedureservice.addcustomprocedure(this.customconfig);
    }
}
