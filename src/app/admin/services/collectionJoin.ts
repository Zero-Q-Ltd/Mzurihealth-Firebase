import {AngularFirestore} from '@angular/fire/firestore';

import {combineLatest, defer, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

/**
 * leftJoin - Joins two collections by a shared document field. Useful when you have a many-to-many relationship, such as Users have many Orders and Order belongs to User.
 * @param afs
 * @param field
 * @param collection
 * @param limit
 */
export const leftJoin = (
    afs: AngularFirestore,
    field,
    collection,
    limit = 100
) => {
    return source =>
        defer(() => {
            // Operator state
            let collectionData;

            // Track total num of joined doc reads
            let totalJoins = 0;

            return source.pipe(
                switchMap(data => {
                    // Clear mapping on each emitted val ;

                    // Save the parent data state
                    collectionData = data as any[];

                    const reads$ = [];
                    for (const doc of collectionData) {
                        // Push doc read to Array

                        if (doc[field]) {
                            // Perform query on join key, with optional limit
                            const q = ref => ref.where(field, '==', doc[field]).limit(limit);

                            reads$.push(afs.collection(collection, q).valueChanges());
                        } else {
                            reads$.push(of([]));
                        }
                    }

                    return combineLatest(reads$);
                }),
                map(joins => {
                    return collectionData.map((v, i) => {
                        totalJoins += joins[i].length;
                        return {...v, [collection]: joins[i] || null};
                    });
                }),
                tap(final => {
                    console.log(
                        `Queried ${(final as any).length}, Joined ${totalJoins} docs`
                    );
                    totalJoins = 0;
                })
            );
        });
};
/**
 * leftJoinDocument - Joins a related doc to each item in a collection. Useful when the documents each have a has-one relationship to some other document. i, e. user has_one country.
 * @param afs
 * @param sourcefield
 * @param collection
 */
export const leftJoinDocument = (afs: AngularFirestore, sourcefield, destinationfield, collection) => {
    return source =>
        defer(() => {
            // Operator state
            let collectionData;
            const cache = new Map();

            return source.pipe(
                switchMap(data => {
                    // Clear mapping on each emitted val ;
                    cache.clear();

                    // Save the parent data state
                    collectionData = data as any[];

                    const reads$ = [];
                    let i = 0;
                    for (const doc of collectionData) {
                        // Skip if doc field does not exist or is already in cache
                        if (!doc[sourcefield] || cache.get(doc[sourcefield])) {
                            continue;
                        }

                        // Push doc read to Array
                        reads$.push(
                            afs
                                .collection(collection)
                                .doc(doc[sourcefield])
                                .valueChanges()
                        );
                        cache.set(doc[sourcefield], i);
                        i++;
                    }

                    return reads$.length ? combineLatest(reads$) : of([]);
                }),
                map(joins => {
                    return collectionData.map((v, i) => {
                        const joinIdx = cache.get(v[sourcefield]);
                        return {...v, [destinationfield]: joins[joinIdx] || null};
                    });
                }),
                tap(final =>
                    console.log(
                        `Queried ${(final as any).length}, Joined ${cache.size} docs`
                    )
                )
            );
        });
};