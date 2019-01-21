export interface PaymentChannel {
    name: string;
    methods: Array<{
        name: string,
        imageurl: string
    }>;
}

export const emptypaymentChannel: PaymentChannel = {
    name: null,
    methods: []
};
