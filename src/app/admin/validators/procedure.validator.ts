import {AbstractControl, ValidatorFn} from '@angular/forms';
import {MergedProcedureModel} from '../../models/MergedProcedure.model';

export class ProcedureValidator {
    static available(allhospitalprocedures: MergedProcedureModel[]): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value && !this.valueAvailable(allhospitalprocedures, c.value)) {
                return {'procedureError': true};
            }
            return null;
        };
    }


    private static valueAvailable(allInsurance: MergedProcedureModel[], input: string): boolean {
        // const fData = allInsurance.filter(value => value.name.toLowerCase() === input.toLowerCase());
        let found = false;
        allInsurance.forEach(value => {
            if (value !== undefined && (value.rawprocedure.name.toLowerCase() === input.toLowerCase())) {
                found = true;
            }
        });
        return found;
    }
}
