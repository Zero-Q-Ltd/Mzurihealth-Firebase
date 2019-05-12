import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, defer, from} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {selectIsDbReady} from '../store/app/app-selectors';

import {AppRootState} from '../store';

@Injectable({
    providedIn: 'root',
})
export class CoreService {
    public constructor(private store: Store<AppRootState>) {
    }

    /**
     * Fires when database is ready for queries
     */
    public whenAuthAndDbReady(): Observable<boolean> {
        return this.store.select(selectIsDbReady).pipe(filter((isDbReady) => isDbReady));
    }

    /**
     * Fires when initial app data (required for everything, e.g. tags list)
     */
    public whenInitDataFetched(): Observable<boolean> {
        return this.store.select().pipe(filter((fetched) => fetched));
    }
}