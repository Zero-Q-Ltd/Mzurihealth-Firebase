import {emptymetadata, Metadata} from './universal';

export interface CustomProcedure {
    creatorid: string;
    id: string;
    regularprice: number
    parentprocedureid: string,
    hospitalid: string,
    insuranceprices: {
        [key: string]: {
            price: number
        }
    }
    custominsuranceprice : boolean
    metadata: Metadata
}

export const emptycustomprocedure: CustomProcedure = {
    creatorid: null,
    id: null,
    regularprice: 0,
    insuranceprices: {},
    parentprocedureid: null,
    hospitalid: null,
    metadata: emptymetadata,
    custominsuranceprice : false
};
