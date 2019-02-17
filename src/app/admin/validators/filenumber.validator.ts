import {AbstractControl, AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {PatientService} from '../services/patient.service';
import {map, take} from 'rxjs/operators';
import {of} from 'rxjs';


export class FilenumberValidator {
    static validate(patientService: PatientService): AsyncValidatorFn {
        return (control: AbstractControl) => {
            console.log(control);
            if (control.value) {
                return patientService.getHospitalFileByNumber(control.value).pipe(
                    take(1),
                    map(d => {
                        return d ? {fileError: true} : null;
                    })
                );
            } else {
                return of([null]);
            }

        };
    }
}