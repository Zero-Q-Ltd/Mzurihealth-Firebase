import {Component, OnInit} from '@angular/core';
import {PaymentmethodService} from '../../services/paymentmethod.service';
import {PaymentChannel} from '../../../models/PaymentChannel';

@Component({
    selector: 'app-hospconfig',
    templateUrl: './hospconfig.component.html',
    styleUrls: ['./hospconfig.component.scss']
})
export class HospconfigComponent implements OnInit {
    allpaymentmethods: Array<PaymentChannel>;
    title: string = 'My first AGM project';
    lat: number = 51.678418;
    lng: number = 7.809007;

    constructor(private paymentmethods: PaymentmethodService) {
        this.paymentmethods.allpaymentchannels.subscribe(methods => {
            this.allpaymentmethods = methods;
        });
    }

    ngOnInit(): void {
    }

    Addpaymentmethods(): void {
        // this.paymentmethods.addallpaymnetmethods();
    }

}
