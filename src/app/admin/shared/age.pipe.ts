import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import {firestore} from 'firebase';

@Pipe({
    name: 'age'
})
export class AgePipe implements PipeTransform {

    transform(birtday: firestore.Timestamp, args?: any): number {
        return moment().diff(birtday ? birtday.toDate().toLocaleDateString() : '', 'years');
    }

}
