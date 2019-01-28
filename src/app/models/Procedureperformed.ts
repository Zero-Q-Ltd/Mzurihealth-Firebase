import {emptymetadata, Metadata} from './universal';

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
    name: string;
    visitid: string;
    procedureid: string;
    metadata: Metadata;
    paymentmethod: Array<{
        type: number,
        data: {
            // To keep the payment details
            // Applies for insurance, cheque, MPESA
            patientid: string,
            transactionid: string,
        }
    }>;
}

export const emptyprocedureperformed: Procedureperformed = {
    id: null,
    name: null,
    results: null,
    adminid: null,
    paymentmethod: [],
    description: null,
    visitid: null,
    procedureid: null,
    metadata: emptymetadata,
    notes: [],
    price: 0
};

