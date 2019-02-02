import {Metadata} from './universal';

export interface Proceduresperformed {
    procedures: Array<Procedureperformed>;
}

export interface Procedureperformed {

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
    price: number;
    adminid: string;
    hospitalid: string;
    patientid: string;
    name: string;
    visitid: string;
    procedureid: string;
    metadata: Metadata;
    paymentmethod: Array<{
        channelid: string;
        amount: number;
        transactionid: string
    }>;

}

export const emptyproceduresperformed: Proceduresperformed = {
    procedures: []
};

