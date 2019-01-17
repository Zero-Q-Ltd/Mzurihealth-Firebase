import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {LocalcommunicationService} from '../localcommunication.service';
import {emptyprawrocedure, RawProcedure} from '../../../../models/RawProcedure';
import {InsuranceService} from '../../../services/insurance.service';
import {InsuranceCompany} from '../../../../models/InsuranceCompany';
import {CustomProcedure, emptycustomprocedure} from '../../../../models/CustomProcedure';
import {ProceduresService} from '../../../services/procedures.service';
import {NotificationService} from '../../../../shared/services/notifications.service';

@Component({
    selector: 'app-procedureconfig',
    templateUrl: './procedureconfig.component.html',
    styleUrls: ['./procedureconfig.component.scss'],
    animations: fuseAnimations

})
export class ProcedureconfigComponent implements OnInit {
    selectecustomprocedure: { rawprocedure: RawProcedure, customprocedure: CustomProcedure } =
        {customprocedure: {...emptycustomprocedure}, rawprocedure: {...emptyprawrocedure}};

    allinsurance: Array<InsuranceCompany> = [];
    filteredinsurance: Array<InsuranceCompany> = [];

    constructor(private communicatioservice: LocalcommunicationService,
                private insuranceservice: InsuranceService,
                private procedureservice: ProceduresService,
                private notificationservice: NotificationService) {
        this.communicatioservice.onprocedureselected.subscribe(selection => {
            console.log(selection);
            this.selectecustomprocedure = selection.selection;

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
        if (this.communicatioservice.onprocedureselected.value.selectiontype === 'newprocedure') {
            this.selectecustomprocedure.customprocedure.parentprocedureid = this.selectecustomprocedure.rawprocedure.id;
            this.procedureservice.addcustomprocedure(this.selectecustomprocedure.customprocedure).then(() => {
                this.notificationservice.notify({
                    placement: 'centre',
                    title: 'Success',
                    alert_type: 'success',
                    body: 'Successfully saved'
                });
                this.communicatioservice.resetall();
            });
        } else {
            this.procedureservice.editcustomprocedure(this.selectecustomprocedure.customprocedure).then(() => {
                this.communicatioservice.resetall();
            });
        }

    }
}
