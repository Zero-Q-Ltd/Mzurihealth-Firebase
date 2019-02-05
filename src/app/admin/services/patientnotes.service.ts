import {Injectable} from '@angular/core';
import {QueueService} from './queue.service';
import {BehaviorSubject} from 'rxjs';
import {emptynote, Patientnote} from '../../models/Patientnote';
import {AngularFirestore} from '@angular/fire/firestore';
import {AdminService} from './admin.service';
import {firestore} from 'firebase';
import Timestamp = firestore.Timestamp;

@Injectable({
    providedIn: 'root'
})
export class PatientnotesService {
    patientnotes: BehaviorSubject<Array<Patientnote>> = new BehaviorSubject<Array<Patientnote>>([]);
    patientid: string;

    constructor(private queueservice: QueueService,
                private db: AngularFirestore,
                private admiservice: AdminService) {
        queueservice.currentpatient.subscribe(value => {
            if (value.patientdata.id) {
                this.patientid = value.patientdata.id;
                this.fetchpatientnotes(value.patientdata.id);
            }
        });
    }

    fetchpatientnotes(id: string): void {
        this.db.firestore.collection('patientnotes')
            .where('patientid', '==', id)
            .limit(100)
            .orderBy('metadata.date', 'desc')
            .onSnapshot(rawdata => {
                this.patientnotes.next(rawdata.docs.map(value => {
                    return Object.assign(emptynote, value.data(), {id: value.id});
                }));
            });
    }

    addnote(note: Patientnote): Promise<any> {
        note.admin = {
            id: this.admiservice.userdata.id,
            name: this.admiservice.userdata.data.displayName
        };
        note.patientid = this.patientid;
        note.metadata = {
            lastedit: Timestamp.now(),
            date: Timestamp.now()
        };
        return this.db.firestore.collection('patientnotes').add(note);

    }

    editnote(): void {

    }
}
