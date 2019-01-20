import {emptymetadata, Metadata} from './universal';

export interface HospitalAdmin {
    id: string;
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
        occupied: string // iud of patient
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
    id: null,
    config: {
        level: null,
        hospitalid: null,
        availability: 0,
        occupied: null,
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
