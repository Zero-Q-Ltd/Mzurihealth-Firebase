import {emptymetadata, Metadata} from './universal';
import {rawprocedurecategory} from './RawProcedure';

export interface Proceduresperformed {
    id: string;
    procedures: Array<Procedureperformed>;
}

export interface Procedureperformed {
    category: rawprocedurecategory;
    results: string;
    /**
     * temporary storage for notes, useful for bulk addition of notes where the behavious of dynamic
     * arrays for ngmodel is unpredictable
     */
    tempnote?: string
    notes: Array<ProcedureNotes>;
    adminid: string;
    hospitalid: string;
    name: string;
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
    category: null,
    results: null,
    notes: [],
    adminid: null,
    hospitalid: null,
    name: null,
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

export interface ProcedureNotes {

    note: string;
    admin: {
        id: string,
        name: string
    };

}