import {emptymetadata, Metadata} from './universal';

export interface Proceduresperformed {
    id: string;
    procedures: Array<Procedureperformed>;
}

export interface Procedureperformed {
    description: string;
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

    originalprocedureid: string;
    customprocedureid: string;
    metadata: Metadata;
    payment: {
        amount: number,
        methods: Array<{
            channelid: string;
            amount: number;
            methidid: string;
            transactionid: string
        }>
        /**
         * whether one of the payment methods is insurance
         */
        hasinsurance: boolean
    };
}

export const emptyprocedureperformed: Procedureperformed = {
    description: null,
    results: null,
    notes: [],
    adminid: null,
    hospitalid: null,
    patientid: null,
    name: null,
    visitid: null,
    originalprocedureid: null,
    customprocedureid: null,
    metadata: emptymetadata,
    payment: {
        amount: 0,
        hasinsurance: false,
        methods: []
    }
};

export const emptyproceduresperformed: Proceduresperformed = {
    id: null,
    procedures: []
};

