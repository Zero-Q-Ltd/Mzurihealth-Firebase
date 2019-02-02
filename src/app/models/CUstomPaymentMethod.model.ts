export interface CUstomPaymentMethod {
    accountnumber: string;
    extrainfo: string;
    paymentchannelid: string;
    paymentmethodid: string;
}

export const emptypaymentmethod: CUstomPaymentMethod = {
    paymentmethodid: '',
    paymentchannelid: '',
    accountnumber: '',
    extrainfo: ''
};
