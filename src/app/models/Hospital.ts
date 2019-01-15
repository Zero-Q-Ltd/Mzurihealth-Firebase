import { firestore } from 'firebase';

export interface Hospital {
  location: firestore.GeoPoint;
  name: string;
  userid: string;
  phone: string;
  email: string;
  id: string;
  description: string;
  contact: {
    name: string,
    phone: string,
    email: string,
    position: string
  };
  patientcount: number;
  invoicecount: number;
  // Patientid :
  procedures: object;
}

export const emptyhospital: Hospital = {
  contact: {
    email: null,
    name: null,
    phone: null,
    position: null
  },
  phone: null,
  email: null,
  location: new firestore.GeoPoint(0, 0),
  name: null,
  id: null,
  userid: null,
  description: null,
  procedures: {},
  patientcount: null,
  invoicecount: null,
};
