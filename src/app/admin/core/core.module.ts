import {NgModule, Optional, SkipSelf} from '@angular/core';
import {RouterStateSerializer} from '@ngrx/router-store';
import {throwIfAlreadyLoaded} from './core-utils';
import {StitchService} from './stitch/stitch.service';
import {AppRouterStateSerializer} from './store/router/router-state-serializer';

@NgModule({
    imports: [],
    providers: [{provide: RouterStateSerializer, useClass: AppRouterStateSerializer}],
})
export class CoreModule {
    public constructor(
        stitch: StitchService,
        @Optional()
        @SkipSelf()
            parentModule?: CoreModule,
    ) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');

        // Connect to MongoDB Stitch ASAP
        stitch.connectToDb();
    }
}
