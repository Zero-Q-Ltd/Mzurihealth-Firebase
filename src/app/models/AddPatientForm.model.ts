export interface AddPatientFormModel {
    personalinfo: {
        firstname: string,
        lastname: string,
        occupation: string,
        idno: number,
        gender: string,
        birth: string,
        email: string,
        workplace: string,
        phone: string,
        address: string,
        fileno: string,
    };
    nextofkin: {
        relationship: string;
        name: string,
        phone: number,
        workplace: string
    };

    insurance: Array<Insurance>;
}

interface Insurance {
    id: string;
    insurancenumber: string;
}


