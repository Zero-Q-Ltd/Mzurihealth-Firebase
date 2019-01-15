export interface CustomProcedure {
    createdby: string;
    name: string;
    description: string;
    refid: string;
    price: number
    // Within this collection are insuance prices for every hospital and
    insuranceprices: {
        [key: string]: {
            price: number
        }
    }
}

export const emptycustomprocedure: CustomProcedure = {
    createdby: null,
    name: null,
    description: null,
    refid: null,
    price: 0,
    insuranceprices: {}
};
