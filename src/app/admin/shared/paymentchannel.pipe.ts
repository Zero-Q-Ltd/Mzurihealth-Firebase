import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentchannel'
})
export class PaymentchannelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
