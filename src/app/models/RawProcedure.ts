export interface RawProcedure {
    name: string,
    id: string
    pricing: {
        max: number | string,
        min: number | string,
    },
    category: rawprocedurecategory

}

export interface rawprocedurecategory {
    id: string,
    code: string,
    subcategoryid: string | null
}

export const emptyprocedureConfig: RawProcedure = {
    name: null,
    id: null,
    pricing: {
        min: 0,
        max: 0
    },
    category: {
        id: null,
        code: null,
        subcategoryid: null
    },
};
