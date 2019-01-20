import {firestore} from 'firebase';
import {emptymetadata, Metadata} from './universal';

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
    paymentchannels: Array<{ name: string, ref: number }>;
    patientcount: number;
    invoicecount: number;
    metadata: Metadata;

}

export const emptyhospital: Hospital = {
    contactperson: {
        email: null,
        name: null,
        phone: null,
        position: null,
        address: null
    },
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
    paymentchannels: []
};
