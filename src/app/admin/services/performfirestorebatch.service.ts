import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class PerformfirestorebatchService {

    constructor(private db: AngularFirestore) {

    }

    /**
     * performs a firestore batch action when fed with an array of firestore refs
     * Allow for atomicity of write actions where several may be linked without being in the same service
     * @param actions
     */
    perform(actions: Array<{ ref: DocumentReference, data: Object, actiontoperform: 'update' | 'set' }>): Promise<void> {
        const batch = this.db.firestore.batch();
        actions.forEach(action => {
            batch[action.actiontoperform](action.ref, action.data);
        });
        return batch.commit();
    }
}
