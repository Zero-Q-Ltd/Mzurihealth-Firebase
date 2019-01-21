import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {Hospital} from '../../models/Hospital';
import {PaymentChannel} from '../../models/PaymentChannel';
import {BehaviorSubject} from 'rxjs';

// import * as paymentchannels from 'assets/paymentchannels.json';

@Injectable({
    providedIn: 'root'
})
export class PaymentmethodService {
    activehospital: Hospital;
    allpaymentchannels: BehaviorSubject<Array<PaymentChannel>> = new BehaviorSubject<Array<PaymentChannel>>([]);

    constructor(private db: AngularFirestore,
                private hospitalservice: HospitalService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.getallpaymentchannels();
            }
        });
    }

    getallpaymentchannels(): void {
        this.db.firestore.collection('paymentchannels').onSnapshot(paymentmethodsdata => {
            this.allpaymentchannels.next(paymentmethodsdata.docs.map(methodata => {
                const paymentChannel = methodata.data() as PaymentChannel;
                paymentChannel.id = methodata.id;
                return paymentChannel;
            }));
        });
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
        //     const channelmethods: Array<Paymentmethods> = paymentchannels.channels[methodname];
        //     const paymentchannel: PaymentChannel = {
        //         name: methodname,
        //         id: null,
        //         /**
        //          * Convert the array to object without giving a fuck
        //          */
        //         // @ts-ignore
        //         methods: {...channelmethods}
        //     };
        //     batch.set(this.db.firestore.collection('paymentchannels').doc(this.db.createId()), paymentchannel);
        // });
        // return await batch.commit();
    }
}
