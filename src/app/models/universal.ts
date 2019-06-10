export interface Customfields {
    id: number;
    value: any;
    name: string;
}

export interface Metadata {
    date: Date;
    lastedit: Date;
}

export const emptymetadata: Metadata = {
    date: null,
    lastedit: null
};