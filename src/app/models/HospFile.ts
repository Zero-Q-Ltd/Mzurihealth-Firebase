import {firestore} from 'firebase';

export interface HospFile {
    id: string;
    date: firestore.Timestamp;
    lastvisit: firestore.Timestamp;
    no: string;
    idno: number;
}

export const emptyfile: HospFile = {
    id: null,
    date: new firestore.Timestamp(0, 0),
    lastvisit: new firestore.Timestamp(0, 0),
    no: '0',
    idno: null
};
