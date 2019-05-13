export interface AdminCategory {
    name: string;
    description: string;
    id: string;
    level: number;
    subcategories: {
        [key: number]: AdminCategory
    };
}

export interface Adminsubcategory {
    name: string;
    description: string;
    level: number;
    /**
     * There can only be a 1: 1 relationship
     */
    parent1: number;
}

export const emptyadminCategory: AdminCategory = {
    name: null,
    description: null,
    id: null,
    level: null,
    subcategories: {}
};
