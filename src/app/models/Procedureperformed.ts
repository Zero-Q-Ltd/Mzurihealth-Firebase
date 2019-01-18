export interface Procedureperformed {
    description: string;
    id: string;
    timestamp: number;
    results: string;
    notes: string;
    adminid: string;
    name: string;
    visitid: string;
    paymentmethod: Array<{
        type: number,
        data: {
            // To keep the payment details
            // Applies for insurance, cheque, MPESA
            patientid: string,
            transactionid: string,
        }
    }>;
}

export const procedureperformed: Procedureperformed = {
    id: null,
    name: null,
    timestamp: null,
    results: null,
    notes: null,
    adminid: null,
    paymentmethod: [],
    description: null,
    visitid: null

};

