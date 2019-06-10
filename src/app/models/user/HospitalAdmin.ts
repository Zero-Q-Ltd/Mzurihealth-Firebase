import {emptymetadata, Metadata} from '../universal';
import {BSON} from 'mongodb-stitch-browser-sdk';

export interface HospitalAdmin {
    _id: BSON.ObjectId;
    status: boolean;
    data: {
        uid: string,
        email: string,
        photoURL: string,
        displayName: string,
    };
    config: {
        hospitalid: string
        categoryid: string
        level: number
        availability: number // Whether on break , away or available
    };
    profiledata?: {
        bio: string,
        age: string,
        address: string,
        phone: string,
        status?: Boolean, // Whether olnine or offline
    };
    metadata: Metadata;

}

export const emptyadmin: HospitalAdmin = {
    _id: null,
    config: {
        level: null,
        hospitalid: null,
        availability: 0,
        categoryid: null
    },
    status: null,
    data: {
        email: null,
        uid: null,
        photoURL: null,
        displayName: null,
    },
    profiledata: {
        address: null,
        age: null,
        bio: null,
        phone: null,
        status: null
    },
    metadata: emptymetadata

};
