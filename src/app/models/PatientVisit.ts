import {emptymetadata, Metadata} from './universal';

export interface PatientVisit {
    procedures: Array<{
        description: string;
        id: string;
        results: string;
        notes: Array<{
            note: string;
            admin: {
                id: string,
                name: string
            };
        }>;
        adminid: string;
        hospitalid: string;
        patientid: string;
        name: string;
        visitid: string;
        procedureid: string;
        metadata: Metadata;
        cost: number,
        paymentmethod: Array<{
            channelid: string;
            amount: number;
            transactionid: string
        }>;
    }>;
    totalcost: number;
    splitpayment: boolean;
    visitdescription: string;
    vitals: {
        height: number,
        weight: number,
        pressure: number,
        sugar: number,
        heartrate: number,
        respiration: number
    };
    generalnotes: Array<{
        adminid: string,
        notes: string
    }>;
    patientid: string;
    hospitalid: string;
    prescription: string;
    metadata: Metadata;
    payment: {
        total: number,
        status: boolean
    };
    id: string;
    invoiceid: number;
    checkin: Checkin;
}

export interface Checkin {
    admin: string;
    /**
     * 0 new
     * 1 waiting
     * 2 being attended
     * 3 waiting for payment
     * 4 completed
     */
    status: 0 | 1 | 2 | 3 | 4;
}

export const emptypatientvisit: PatientVisit = {
    procedures: [],
    totalcost: 0,
    splitpayment: false,
    visitdescription: null,
    vitals: {
        height: null,
        weight: null,
        pressure: null,
        sugar: null,
        heartrate: null,
        respiration: null
    },
    invoiceid: 0,
    generalnotes: [],
    checkin: {
        status: null,
        admin: null
    },
    payment: {
        total: 0,
        status: false
    },
    patientid: null,
    hospitalid: null,
    prescription: null,
    metadata: emptymetadata,
    id: null
};

