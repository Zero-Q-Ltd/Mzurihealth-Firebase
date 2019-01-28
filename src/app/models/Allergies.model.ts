import {Metadata} from './universal';

export type allergy = 'respiratory' | 'food' | 'skin' | 'other' ;
export const allerytypearray = ['respiratory', 'food', 'skin', 'other'];

interface Allegy {
    type: allergy;
    detail: string;
    metadata: Metadata;
}
