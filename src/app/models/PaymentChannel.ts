export interface PaymentChannel {
    id: string;
    name: string;
    methods: Array<{
        name: string,
        imageurl: string
    }>;
}

export const emptypaymentChannel: PaymentChannel = {
    name: null,
    id: null,
    methods: []
};
