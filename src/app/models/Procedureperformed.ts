export interface Procedureperformed {
  description: string;
  id: string;
  timestamp: number;
  results: string;
  notes: string;
  user: {
    name: string
    uid: string
  };
  name: string;
  paymentmethod: Array<{
    type: number,
    data: {
      // To keep the payment details
      // Applies for insurance, cheque, MPESA
      refid: string,
      transactionid: string,
      name: string
    }
  }>;
}

export const procedureperformed: Procedureperformed = {
  id: null,
  name: null,
  timestamp: null,
  results: null,
  notes: null,
  user: {
    name: null,
    uid: null
  },
  paymentmethod: [],
  description: null

};
