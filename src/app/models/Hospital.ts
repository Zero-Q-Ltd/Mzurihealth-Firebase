import {firestore} from 'firebase';
import {emptymetadata, Metadata} from './universal';
import {CustomPaymentMethod} from './CustomPaymentMethod.model';

export interface Hospital {
    location: firestore.GeoPoint;
    name: string;
    userid: string;
    id: string;
    description: string;
    status: boolean;
    contactperson: {
        name: string,
        phone: string,
        email: string,
        position: string,
        address: string
    };
    contactdetails: {
        phone: string,
        email: string,
        address: string
    };
    logourl: string;
    patientcount: number;
    invoicecount: number;
    metadata: Metadata;
    paymentmethods: Array<CustomPaymentMethod>;
}

export const emptyhospital: Hospital = {
    contactperson: {
        email: null,
        name: null,
        phone: null,
        position: null,
        address: null
    },
    logourl: null,
    status: null,
    contactdetails: {
        email: null,
        phone: null,
        address: null
    },
    location: new firestore.GeoPoint(0, 0),
    name: null,
    id: null,
    userid: null,
    description: null,
    patientcount: null,
    invoicecount: null,
    metadata: emptymetadata,
    paymentmethods: []
};
