import { firestore } from 'firebase';

export interface PatientVisit {
  paymentmethod: {
    type: number,
    splitpayment: boolean,
    data: {
      // To keep the payment details
      // Applies for insurance, cheque, MPESA
      // id for cash is null
      id: string,
      name: string
    }
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
  notes: {
    // The doctor's id then the notes
  };

  patientref: string;
  hospitalid: string;
  prescription: string;
  timestamp: firestore.Timestamp;
  // whether this date has been paid for
  // Temporary data duplication until the patient leaves
  status: number;
  paid: boolean;
  refid: string;
  checkin: checkin
}

export interface checkin {
  admin: string,
  /**
   * 0 new
   * 1 waiting
   * 2 being attended
   * 3 waiting for payment
   */
  status: 0 | 1 | 2 | 3
}

export const emptypatienthistory: PatientVisit = {
  paymentmethod: {
    type: -1,
    splitpayment: null,
    data: {
      // To keep the payment details
      // Applies for insurance, cheque, MPESA
      // id for cash is null
      id: null,
      name: null
    }
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
  notes: {
    // The doctor's id then the notes
  },
  checkin: {
    status: null,
    admin: null
  },
  status: null,
  paid: null,
  patientref: null,
  hospitalid: null,
  prescription: null,
  timestamp: null,
  refid: null

};
