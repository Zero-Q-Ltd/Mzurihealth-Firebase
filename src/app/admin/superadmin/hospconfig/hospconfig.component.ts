import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel} from '../../../models/PaymentChannel';
import {emptyhospital, Hospital} from '../../../models/Hospital';
import {HospitalService} from '../../services/hospital.service';
import {MouseEvent} from '@agm/core';
import {firestore} from 'firebase';
import {NotificationService} from '../../../shared/services/notifications.service';
import {FuseConfirmDialogComponent} from '../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {emptypaymentmethod} from '../../../models/PaymentMethod';
import {LocalcommunicationService} from '../procedures/localcommunication.service';
import {fuseAnimations} from '../../../../@fuse/animations';

declare let google: any;

@Component({
    selector: 'app-hospconfig',
    templateUrl: './hospconfig.component.html',
    styleUrls: ['./hospconfig.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class HospconfigComponent implements OnInit {
    allpaymentchannels: Array<PaymentChannel>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    defaultlat = -1.2939519;
    defaultlng = 36.8311134;
    zoom = 12;
    temphospital: Hospital = {...emptyhospital};
    originalhspital: Hospital = {...emptyhospital};

    paymentchannels: Array<PaymentChannel> = [];

    constructor(private paymentmethodService: PaymentmethodService,
                private hospitalservice: HospitalService,
                private notificationservice: NotificationService,
                private communicatioservice: LocalcommunicationService,
                private _matDialog: MatDialog) {
        this.paymentmethodService.allpaymentchannels.subscribe(channels => {
            this.allpaymentchannels = channels;
        });
        /**
         * because this component is ot using reactive forms which is not neccessary, subscribe to tab changes and reset the values so
         * that unsaved changes are ignored and the view is reset to the old values
         */
        communicatioservice.ontabchanged.subscribe(tab => {
            // console.log('tabchanged');
            if (tab === 2) {
                this.initvalues();
            }
        });
    }

    initvalues(): void {
        this.hospitalservice.activehospital.subscribe(hosp => {
            // console.log(hosp);
            /**
             * create a new variable
             */
            this.originalhspital = hosp;
            if (hosp.paymentmethods.length < 1) {
                this.originalhspital.paymentmethods.push({...emptypaymentmethod});
            }
            this.temphospital = {...this.originalhspital};
            /**
             * initialize some vars
             */
            if (!hosp.location) {
                this.temphospital.location = new firestore.GeoPoint(this.defaultlat, this.defaultlng);
            } else {
                this.defaultlat = hosp.location.latitude;
                this.defaultlng = hosp.location.longitude;
                this.zoom = 15;
            }

        });
    }

    mapClicked($event: MouseEvent): void {
        const location: firestore.GeoPoint = new firestore.GeoPoint($event.coords.lat, $event.coords.lng);
        this.temphospital.location = location;
    }

    ngOnInit(): void {

    }

    savehospitalchanges(): void {
        console.log(JSON.stringify(this.temphospital) === JSON.stringify(this.originalhspital));
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to save these changes?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.hospitalservice.savehospitalchanges(this.temphospital).then(() => {

                    this.notificationservice.notify({
                        placement: 'centre',
                        title: 'Success',
                        alert_type: 'success',
                        body: 'Cancelled'
                    });
                });
            }
        });
    }

    addpaymentarray(): void {
        this.temphospital.paymentmethods.push({...emptypaymentmethod});
    }

    channelselected(channel: PaymentChannel, index: number): void {
        this.temphospital.paymentmethods[index].paymentchannelid = channel.id;
    }

    methodselected(methodid: string, index: number): void {
        this.temphospital.paymentmethods[index].paymentmethodid = methodid;
        console.log(this.temphospital.paymentmethods[index]);
    }

    getpaymentchannel(id: string): PaymentChannel | null {
        if (!id) {
            return null;
        }
        const paymentchannel = this.allpaymentchannels.find(channel => {
            return channel.id === id;
        });
        // console.log(paymentchannel);
        return paymentchannel;
    }

    deletepayment(index: number): void {
        this.temphospital.paymentmethods.splice(index, 1);
    }

    getpaymentmethod(paymentchannelid: string, paymentmethodid: string): string | null {
        if (!paymentchannelid || !paymentmethodid) {
            return null;
        }
        return this.allpaymentchannels.find(channel => {
            return channel.id === paymentchannelid;
        }).methods[paymentmethodid].name;
    }

    Addpaymentmethods(): void {
        // this.paymentmethodService.addallpaymnetmethods();
    }

}
