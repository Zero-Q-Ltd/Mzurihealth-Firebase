import {Pipe, PipeTransform} from '@angular/core';
import {PaymentChannel} from '../../models/PaymentChannel';

@Pipe({
    name: 'paymentmethod'
})
export class PaymentmethodPipe implements PipeTransform {

    transform(allpaymentchannels: Array<PaymentChannel>, channelid: string, methodid: string): string {
        return allpaymentchannels.find(value => {
            return value.id === channelid;
        }).methods[methodid].name;
    }

}
