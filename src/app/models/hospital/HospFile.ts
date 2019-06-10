
export interface HospFile {
    id: string;
    date: Date;
    lastvisit: Date;
    no: string;
    idno: number;
    visitcount: number;
}

export const emptyfile: HospFile = {
    id: null,
    date: null,
    lastvisit: null,
    no: '0',
    idno: null,
    visitcount: 0
};
