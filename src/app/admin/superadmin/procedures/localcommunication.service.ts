import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RawProcedure} from '../../../models/RawProcedure';
import {CustomProcedure} from '../../../models/CustomProcedure';

@Injectable({
    providedIn: 'root'
})
export class LocalcommunicationService {
    onprocedureselected: BehaviorSubject<{
        selectiontype: 'newprocedure' | 'customprocedure' | null,
        selection: { rawprocedure: RawProcedure, customprocedure: CustomProcedure }
    }> = new BehaviorSubject({selectiontype: null, selection: null});
    activetab = new BehaviorSubject<number>(null);

    constructor() {

    }

    resetall() {
        this.onprocedureselected.next({selectiontype: null, selection: null});
    }
}
