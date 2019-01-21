import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {Hospital} from '../../models/Hospital';
import {PaymentChannel} from '../../models/PaymentChannel';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentmethodService {
    activehospital: Hospital;
    allpaymentmethods: BehaviorSubject<Array<PaymentChannel>> = new BehaviorSubject<Array<PaymentChannel>>([]);

    constructor(private db: AngularFirestore,
                private hospitalservice: HospitalService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.getallpaymentmethods();
            }
        });
    }

    getallpaymentmethods(): void {

    }

    async addallpaymnetmethods(): Promise<void> {
        /**
         * import * as paymentchannels from 'assets/paymentchannels.json';
         */
        // const paymnetmethodkeys = Object.keys(paymentchannels.channels);
        // const batch = this.db.firestore.batch();
        //
        // paymnetmethodkeys.forEach(async (methodname: string) => {
        //     console.log(methodname);
        //     const paymentchannel: PaymentChannel = {
        //         name: methodname,
        //         methods: paymentchannels.channels[methodname]
        //     };
        //     batch.set(this.db.firestore.collection('paymentchannels').doc(this.db.createId()), paymentchannel);
        // });
        // return await batch.commit();
    }
}
