import {AbstractControl, ValidatorFn} from '@angular/forms';
import {PatientService} from '../services/patient.service';
import {map, take} from 'rxjs/operators';


export class FilenumberValidator {
    static validate(patientService: PatientService): ValidatorFn {
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
                return null;
            }

        };
    }
}