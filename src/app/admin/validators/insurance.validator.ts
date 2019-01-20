import {AbstractControl, ValidatorFn} from '@angular/forms';
import {InsuranceCompany} from '../../models/InsuranceCompany';

export class InsuranceValidator {
    static available(allInsurance: InsuranceCompany[]): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            if (c.value && !this.valueAvailable(allInsurance, c.value)) {
                return {'insuranceError': true};
            }
            return null;
        };
    }


    private static valueAvailable(allInsurance: InsuranceCompany[], input: string): boolean {
        // const fData = allInsurance.filter(value => value.name.toLowerCase() === input.toLowerCase());
        let found = false;
        allInsurance.forEach(value => {
            if (value !== undefined && (value.name.toLowerCase() === input.toLowerCase())) {
                found = true;
            }
        });
        return found;
    }
}
