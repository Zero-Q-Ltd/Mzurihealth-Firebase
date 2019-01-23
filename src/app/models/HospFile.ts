import {firestore} from 'firebase';

export interface HospFile {
    date: firestore.Timestamp;
    lastvisit: firestore.Timestamp;
    no: string;
}

export const emptyfile: HospFile = {
    date: new firestore.Timestamp(0, 0),
    lastvisit: new firestore.Timestamp(0, 0),
    no: '0'
};
