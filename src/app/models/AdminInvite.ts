import {emptymetadata, Metadata} from './universal';

export interface AdminInvite {
    email: string;
    name: string;
    phone: string;
    categoyid: string;
    level: number;
    inviterid: string;
    hospitalid: string;
    metadata: Metadata;
    id: string
}

export const emptyadmininvite = {
    email: null,
    name: null,
    phone: null,
    categoyid: null,
    level: null,
    inviterid: null,
    hospitalid: null,
    id: null,
    metadata: emptymetadata
};
