import {Customfields, emptymetadata, Metadata} from './universal';
import {firestore} from 'firebase/app';
import {emptyfile, HospFile} from './HospFile';
import {Condition} from './MedicalConditions.model';
import {Allegy} from './Allergy.model';

export interface Patient {
    personalinfo: {
        address: string,
        photoURL: string
        name: string,
        gender: number,
        occupation: string,
        workplace: string,
        phone: number,
        email: string,
        idno: string,
        dob: firestore.Timestamp,
    };
    fileinfo?: HospFile;
    id: string;
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
    insurance: Array<Insurance>;
    medicalinfo: {
        bloodtype: string,
        conditions: Array<Condition>
        allergies: Array<Allegy>;
        vitals: {
            height: number,
            weight: number,
            pressure: number,
            sugar: number,
            heartrate: number,
            respiration: number,
            hb: string,
        };
        metadata: Metadata;
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
        gender: 0,
        occupation: null,
        workplace: null,
        phone: null,
        email: null,
        idno: null,
        dob: null,
    },
    id: null,
    nextofkin: {
        name: null,
        relationship: null,
        phone: null,
        workplace: null
    },
    insurance: [],
    medicalinfo: {
        bloodtype: null,
        conditions: [],
        allergies: [],
        vitals: {
            height: null,
            weight: null,
            pressure: null,
            sugar: null,
            heartrate: null,
            respiration: null,
            hb: null
        },
        metadata: emptymetadata
    },
    status: true,
    exrainfo: null,
    primaryhosp: null,
    customfuelds: [],
    metadata: emptymetadata,
};

