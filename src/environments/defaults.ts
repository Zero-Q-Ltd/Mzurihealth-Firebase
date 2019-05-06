import {AppEnvironment} from './model';

export const defaultEnvironmentConfig: AppEnvironment = {
    /**
     * Production environment
     */
    production: false,
    hmr: false,

    /**
     * MongoDB Stitch settings
     */
    mongo: {
        stitchAppId: 'first-sdnxa',
        database: 'Mzurihealth',
    },
};
