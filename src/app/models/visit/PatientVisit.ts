import {emptymetadata, Metadata} from '../universal';
import {Procedureperformed} from '../procedure/Procedureperformed';

export interface PatientVisit {
    procedures: Array<Procedureperformed>;
    totalcost: number;
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
        splitpayment: boolean;
        total: number,
        status: boolean,
        hasinsurance: boolean,
        singlepayment?: {
            channelid: string;
            amount: number;
            methidid: string;
            transactionid: string
        }
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
        splitpayment: false,
        total: 0,
        status: false,
        hasinsurance: false,
    },
    patientid: null,
    hospitalid: null,
    prescription: null,
    metadata: emptymetadata,
    id: null
};

