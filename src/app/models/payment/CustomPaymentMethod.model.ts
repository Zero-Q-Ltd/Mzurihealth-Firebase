export interface CustomPaymentMethod {
    accountNumber: string;
    extraInfo: string;
    paymentChannelId: string;
    paymentMethodId: string;
}

export const emptypaymentmethod: CustomPaymentMethod = {
    paymentMethodId: '',
    paymentChannelId: '',
    accountNumber: '',
    extraInfo: ''
};
