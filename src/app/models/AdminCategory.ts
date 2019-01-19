export interface AdminCategory {
    name: string;
    description: string;
    id: string;
    level: number;
    subcategories: {
        /**
         * Used an object so that deletions do not force database refactoring
         */
        [key: number]: {
            name: string;
            description: string;
            level: number;
            /**
             * There can only be a 1: 1 relationship
             */
            parent1: number
        }
    };
}

export const emptyadminCategory: AdminCategory = {
    name: null,
    description: null,
    id: null,
    level: null,
    subcategories: {}
};
