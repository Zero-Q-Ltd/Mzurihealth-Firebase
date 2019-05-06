import {AppEnvironment} from './model';

export const defaultEnvironmentConfig: AppEnvironment = {
    /**
     * Production environment
     */
    production: false,
    hmr: true,

    /**
     * MongoDB Stitch settings
     */
    mongo: {
        stitchAppId: 'dev-what-conference-next-kzfdc',
        database: 'wcn-db',
    },
};
