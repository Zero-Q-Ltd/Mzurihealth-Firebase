export interface HospitalAdmin {
  id: string;
  data: {
    uid: string,
    email: string,
    photoURL: string,
    displayName: string,
  };
  config?: {
    hospitalid: string
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
}

export const emptyadmin: HospitalAdmin = {
  id: null,
  config: {
    level: null,
    hospitalid: null,
    availability: 0,
    occupied: null
  },
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
  }
};
