import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {LocalcommunicationService} from '../localcommunication.service';
import {emptyprocedureConfig, RawProcedure} from '../../../../models/RawProcedure';
import {InsuranceService} from '../../../services/insurance.service';
import {InsuranceCompany} from '../../../../models/InsuranceCompany';
import {CustomProcedure, emptycustomprocedure} from '../../../../models/CustomProcedure';

@Component({
    selector: 'app-procedureconfig',
    templateUrl: './procedureconfig.component.html',
    styleUrls: ['./procedureconfig.component.scss'],
    animations: fuseAnimations

})
export class ProcedureconfigComponent implements OnInit {
    selectedprocedure: RawProcedure = {...emptyprocedureConfig};
    allinsurance: Array<InsuranceCompany> = [];
    custominsuranceprice = false;
    customconfig: CustomProcedure = {...emptycustomprocedure};

    constructor(private communicatioservice: LocalcommunicationService, private insuranceservice: InsuranceService) {
        this.communicatioservice.onProcedureselected.subscribe(procedure => {
            this.selectedprocedure = procedure;
        });
        this.insuranceservice.allinsurance.subscribe(insurance => {
            this.allinsurance = insurance;
        });
    }

    ngOnInit() {
    }

    saveprocedureconfig() {

    }
}
