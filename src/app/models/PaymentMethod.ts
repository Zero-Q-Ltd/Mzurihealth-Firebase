export interface PaymentMethod {
    accountnumber: string;
    extrainfo: string;
    paymentchannelid: string;
    paymentmethodid: string;
}

export const emptypaymentmethod: PaymentMethod = {
    paymentmethodid: '',
    paymentchannelid: '',
    accountnumber: '',
    extrainfo: ''
};
