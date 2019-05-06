export interface AppEnvironment {
    /**
     * Production environment
     */
    production: boolean;
    /**
     * Hmr for mobile support
     */
    hmr: boolean;
    /**
     * MongoDB Stitch settings
     */
    mongo: {
        stitchAppId: string;
        database: string;
    };

    /**
     * Google Analytics tracking ID
     */
    gaTrackingId?: string;
}
