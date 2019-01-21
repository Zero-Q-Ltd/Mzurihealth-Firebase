import {Component, OnInit} from '@angular/core';
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

declare let google: any;

@Component({
    selector: 'app-hospconfig',
    templateUrl: './hospconfig.component.html',
    styleUrls: ['./hospconfig.component.scss']
})
export class HospconfigComponent implements OnInit {
    allpaymentchannels: Array<PaymentChannel>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    defaultlat = -1.2939519;
    defaultlng = 36.8311134;
    zoom = 12;
    activehospital: Hospital = emptyhospital;
    paymentchannels: Array<PaymentChannel> = [];

    constructor(private paymentmethodService: PaymentmethodService,
                private hospitalservice: HospitalService,
                private notificationservice: NotificationService,
                private _matDialog: MatDialog) {
        this.paymentmethodService.allpaymentchannels.subscribe(channels => {
            this.allpaymentchannels = channels;
        });
        this.hospitalservice.activehospital.subscribe(hosp => {
            this.activehospital = hosp;
            /**
             * initialize some vars
             */
            if (!hosp.location) {
                this.activehospital.location = new firestore.GeoPoint(this.defaultlat, this.defaultlng);
            }
            if (hosp.paymentmethods.length < 1) {
                this.addpaymentarray();
            }
        });
    }

    mapClicked($event: MouseEvent): void {
        const location: firestore.GeoPoint = new firestore.GeoPoint($event.coords.lat, $event.coords.lng);
        this.activehospital.location = location;
    }

    ngOnInit(): void {

    }

    savehospitalchanges(): void {
        console.log(this.activehospital);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to save these changes?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.hospitalservice.savehospitalchanges(this.activehospital).then(() => {

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
        this.activehospital.paymentmethods.push({...emptypaymentmethod});
    }

    channelselected(channel: PaymentChannel, index: number): void {
        this.activehospital.paymentmethods[index].paymentchannelid = channel.id;
    }

    methodselected(methodid: string, index: number): void {
        this.activehospital.paymentmethods[index].paymentmethodid = methodid;
        console.log(this.activehospital.paymentmethods[index]);
    }

    getpaymentchannel(id: string): PaymentChannel | null {
        if (!id) {
            return null;
        }
        return this.allpaymentchannels.find(channel => {
            return channel.id === id;
        });
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
