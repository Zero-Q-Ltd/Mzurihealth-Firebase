import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {emptyprawrocedure, RawProcedure} from '../../../models/RawProcedure';

@Injectable({
    providedIn: 'root'
})
export class LocalcommunicationService {
    onProcedureselected: BehaviorSubject<RawProcedure> = new BehaviorSubject<RawProcedure>({...emptyprawrocedure});
    selectedtype = new BehaviorSubject<string>(null);

    constructor() {
        this.onProcedureselected.subscribe((procedure) => {
            if (procedure.id) {
                this.selectedtype.next('procedure');
            }
        });
    }

    resetall() {
        this.onProcedureselected.next({...emptyprawrocedure});
        this.selectedtype.next(null);
    }
}
