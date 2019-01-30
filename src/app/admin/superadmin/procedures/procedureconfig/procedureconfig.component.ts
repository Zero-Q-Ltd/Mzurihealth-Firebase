import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {LocalcommunicationService} from '../../localcommunication.service';
import {emptyprawrocedure, RawProcedure} from '../../../../models/RawProcedure';
import {CustomProcedure, emptycustomprocedure} from '../../../../models/CustomProcedure';
import {ProceduresService} from '../../../services/procedures.service';
import {NotificationService} from '../../../../shared/services/notifications.service';
import * as moment from 'moment';
import {FormControl, Validators} from '@angular/forms';
import {PaymentmethodService} from '../../../services/paymentmethod.service';
import {Paymentmethods} from '../../../../models/PaymentChannel';

@Component({
    selector: 'app-procedureconfig',
    templateUrl: './procedureconfig.component.html',
    styleUrls: ['./procedureconfig.component.scss'],
    animations: fuseAnimations

})
export class ProcedureconfigComponent implements OnInit {
    selectecustomprocedure: { rawprocedure: RawProcedure, customprocedure: CustomProcedure } =
        {customprocedure: {...emptycustomprocedure}, rawprocedure: {...emptyprawrocedure}};

    filteredinsurance: { [key: string]: Paymentmethods } = {};
    regularpricecontrol = new FormControl('', [
        Validators.required,
        Validators.min(0),
    ]);

    constructor(private communicatioservice: LocalcommunicationService,
                private paymentethods: PaymentmethodService,
                private procedureservice: ProceduresService,
                private notificationservice: NotificationService) {
        this.communicatioservice.onprocedureselected.subscribe(selection => {
            if (!selection.selectiontype) {
                return;
            }
            this.selectecustomprocedure = selection.selection;
            this.regularpricecontrol.patchValue(this.selectecustomprocedure.customprocedure.regularprice);
        });

        this.paymentethods.allinsurance.subscribe(insurance => {
            this.filteredinsurance = insurance;
        });
    }

    ngOnInit(): void {
    }

    filterinsurance(filterValue: string): void {
        if (filterValue) {
            const temp = {};
            filterValue = filterValue.trim();
            filterValue = filterValue.toLowerCase();
            Object.keys(this.paymentethods.allinsurance.value).forEach(key => {
                if (this.paymentethods.allinsurance.value[key].name.toLowerCase().indexOf(filterValue) > -1) {
                    temp[key] = this.paymentethods.allinsurance.value[key];
                }
            });
            this.filteredinsurance = temp;
        } else {
            this.filteredinsurance = this.paymentethods.allinsurance.value;
        }
    }

    getdate(): string {
        return moment().toDate().toDateString();
    }

    clearselection(): void {
        this.communicatioservice.resetall();
    }

    saveprocedureconfig(): void {
        if (!this.regularpricecontrol.errors) {
            this.selectecustomprocedure.customprocedure.regularprice = this.regularpricecontrol.value;
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
        } else {
            this.notificationservice.notify({
                placement: 'centre',
                title: 'Error',
                alert_type: 'error',
                body: 'Regular price is required'
            });
        }
    }
}
