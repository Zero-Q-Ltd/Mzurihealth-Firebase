export interface CustomPaymentMethod {
    accountnumber: string;
    extrainfo: string;
    paymentchannelid: string;
    paymentmethodid: string;
}

export const emptypaymentmethod: CustomPaymentMethod = {
    paymentmethodid: '',
    paymentchannelid: '',
    accountnumber: '',
    extrainfo: ''
};
