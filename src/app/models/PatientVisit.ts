import {firestore} from 'firebase';

export interface PatientVisit {
    paymentmethod: {
        /**
         * 0 cash methods
         * 1 insurance
         * 2 both 0&1
         */
        type: number,
    };
    visitdescription: string;
    vitals: {
        height: number,
        weight: number,
        pressure: number,
        sugar: number,
        heartrate: number,
        respiration: number
    };
    generalnotes: Array<{
        adminid: string,
        notes: string
    }>,
    patientid: string;
    hospitalid: string;
    prescription: string;
    timestamp: firestore.Timestamp;
    paid: boolean;
    id: string;
    checkin: Checkin;
}

export interface Checkin {
    admin: string;
    /**
     * 0 new
     * 1 waiting
     * 2 being attended
     * 3 waiting for payment
     * 4 completed
     */
    status: 0 | 1 | 2 | 3 | 4;
}

export const emptypatientvisit: PatientVisit = {
    paymentmethod: {
        type: 0
    },
    visitdescription: null,
    vitals: {
        height: null,
        weight: null,
        pressure: null,
        sugar: null,
        heartrate: null,
        respiration: null
    },
    generalnotes: [],
    checkin: {
        status: null,
        admin: null
    },
    paid: false,
    patientid: null,
    hospitalid: null,
    prescription: null,
    timestamp: null,
    id: null

};
