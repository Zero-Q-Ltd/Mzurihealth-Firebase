import {Customfields, emptymetadata, Metadata} from './universal';
import {firestore} from 'firebase';
import {HospFile} from './HospFile';

export interface Patient {
    personalinfo: {
        address: string,
        photoURL: string
        name?: string,
        firstname: string,
        secondname: string,
        gender: number,
        occupation: string,
        workplace: string,
        phone: number,
        email: string,
        idno: string,
        birth: string,
        dob: firestore.Timestamp,
    };
    fileinfo?: HospFile;
    id?: string;
    /**
     * Optional parent id number for minors
     */
    parentid?: string;

    nextofkin: {
        name: string,
        relationship: string,
        phone: number,
        workplace: string
    };
    /**
     * A patient can have several insurances at the same time
     */
    insurance: {
        [key: string]: Insurance
    };
    medicalinfo: {
        bloodtype: string,
        conditions: Array<Coditions>
        allergies: Array<string>;
    };
    /**
     * used in queries so that you can optionally disable some patients
     */
    status: boolean;
    exrainfo: string;
    customfuelds?: Array<Customfields>;
    primaryhosp: string;
    metadata: Metadata;
}

interface Insurance {
    id: string;
    insuranceno: string;
}

export const emptypatient: Patient = {
    personalinfo: {
        address: null,
        photoURL: null,
        name: null,
        firstname: null,
        secondname: null,
        gender: 0,
        occupation: null,
        workplace: null,
        phone: null,
        email: null,
        idno: null,
        dob: null,
        birth: null
    },
    id: null,
    nextofkin: {
        name: null,
        relationship: null,
        phone: null,
        workplace: null
    },
    insurance: {},
    medicalinfo: {
        bloodtype: null,
        conditions: [],
        allergies: [],
    },
    status: null,
    exrainfo: null,
    primaryhosp: null,
    customfuelds: [],
    metadata: emptymetadata

};

