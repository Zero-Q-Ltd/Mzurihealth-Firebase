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

    constructor(private paymentmethods: PaymentmethodService) {
        this.paymentmethods.allpaymentmethods.subscribe(methods => {
            this.allpaymentmethods = methods;
        });
    }

    ngOnInit(): void {
    }

    Addpaymentmethods(): void {
        // this.paymentmethods.addallpaymnetmethods();
    }

}
