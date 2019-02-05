import {firestore} from 'firebase/app';

export interface Customfields {
    id: number;
    value: any;
    name: string;
}

export interface Metadata {
    date: firestore.Timestamp;
    lastedit: firestore.Timestamp;
}

export const emptymetadata: Metadata = {
    date: null,
    lastedit: null
};