export interface PaymentChannel {
    id: string;
    name: string;
    methods: {
        [key: string]: Paymentmethods
    };
}

export interface Paymentmethods {
    name: string;
    imageurl: string;
}

export const emptypaymentChannel: PaymentChannel = {
    name: null,
    id: null,
    methods: {}
};
