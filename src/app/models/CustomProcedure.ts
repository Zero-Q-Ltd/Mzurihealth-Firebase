import {firestore} from 'firebase';
import {emptymetadata, Metadata} from './universal';

export interface CustomProcedure {
    creatorid: string;
    name: string;
    id: string;
    regularprice: number
    parentprocedureid: string,
    hospitalid: string,
    insuranceprices: {
        [key: string]: {
            price: number
        }
    }
    metadata: Metadata
}

export const emptycustomprocedure: CustomProcedure = {
    creatorid: null,
    name: null,
    id: null,
    regularprice: 0,
    insuranceprices: {},
    parentprocedureid: null,
    hospitalid: null,
    metadata: emptymetadata

};
