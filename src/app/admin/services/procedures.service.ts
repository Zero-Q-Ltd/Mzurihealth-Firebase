import {Injectable} from '@angular/core';
import {AngularFirestore, Query} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {Hospital} from '../../models/hospital/Hospital';
import {CustomProcedure} from '../../models/procedure/CustomProcedure';
import {ProcedureCategory} from '../../models/procedure/ProcedureCategory';
import {NotificationService} from '../../shared/services/notifications.service';
import {firestore} from 'firebase/app';
import {RawProcedure} from '../../models/procedure/RawProcedure';
import {HospitalAdmin} from '../../models/user/HospitalAdmin';
import {AdminService} from './admin.service';
import {map, switchMap} from 'rxjs/operators';
import Timestamp = firestore.Timestamp;

@Injectable({
    providedIn: 'root'
})
export class ProceduresService {
    hospitalprocedures: BehaviorSubject<Array<{ rawprocedure: RawProcedure, customprocedure: CustomProcedure }>> =
        new BehaviorSubject<Array<{ rawprocedure: RawProcedure, customprocedure: CustomProcedure }>>([]);
    activehospital: Hospital;
    procedurecategories: BehaviorSubject<Array<ProcedureCategory>> = new BehaviorSubject<Array<ProcedureCategory>>([]);
    userdata: HospitalAdmin;

    constructor(private db: AngularFirestore,
                private hospitalservice: HospitalService,
                private notificationservice: NotificationService,
                private adminservice: AdminService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.getprocedures();
                this.getprocedurecategories();
            }
        });
        this.adminservice.observableuserdata.subscribe(userdata => {
            this.userdata = userdata as HospitalAdmin;
        });
    }

    getprocedures(): void {
        /**
         * I honestly am not sure why the following code works so well
         * Please.... be very careful before changing
         */
        this.db.collection('procedureconfigs', ref => ref.where('hospitalid', '==', this.activehospital.id).where('status', '==', true)).snapshotChanges().pipe(
            switchMap(f => {
                return combineLatest(...f.map(t => {
                    const customprocedure = t.payload.doc.data() as CustomProcedure;
                    customprocedure.id = t.payload.doc.id;
                    return this.db.collection('procedures').doc(customprocedure.parentprocedureid).snapshotChanges().pipe(
                        map(originalproceduredata => {
                            const rawprocedure = originalproceduredata.payload.data() as RawProcedure;
                            rawprocedure.id = originalproceduredata.payload.id;
                            return ({rawprocedure: rawprocedure, customprocedure: customprocedure});
                        })
                    );
                }));
            })
        ).subscribe(mergedData => {
            this.hospitalprocedures.next(mergedData);
        });
    }

    fetchproceduresincategory(categoryid: string): Query {
        return this.db.firestore.collection('procedures').where('category.id', '==', categoryid);
    }

    disableprocedure(procedureid: string): Promise<void> {
        return this.db.firestore.collection('procedureconfigs').doc(procedureid).update({status: false});
    }

    getprocedurecategories(): void {
        this.db.firestore.collection('procedurecategories').orderBy('name', 'asc').onSnapshot(rawdocs => {
            this.procedurecategories.next(rawdocs.docs.map(rawdoc => {
                const procedurecategory: ProcedureCategory = rawdoc.data() as ProcedureCategory;
                procedurecategory.id = rawdoc.id;
                return procedurecategory;
            }));
            // console.log('done fetching ');
        });
    }

    syncprocedures(): any {
        interface RawprocedureFromjson {
            'CODE': string;
            'Name': string;
            'Minimum': string;
            'Maximum': string;
            'Type': string;
            'Category': string;
            'Code': string;
            'SubCategoty': string;
            'NUMERICID': string;
        }

        /**
         * In case you ever need to rewrite the categories again, make sure to also rewrite the procedures as new ids will be assigned
         * also remember to add the import statement for the json
         * import * as proceduredata from 'assets/procedures.json';
         */
        /*procedurecats.categories.forEach(async (category: ProcedureCategory) => {
          let batch = this.db.firestore.batch();
          category.name = category.name.toLowerCase();
          if(category.subcategories){
            Object.keys(category.subcategories).forEach(key =>{
              category.subcategories[key].name = category.subcategories[key].name.toLowerCase();
            });
          }
          batch.set(this.db.firestore.collection('procedurecategories').doc(this.db.createId()), category);
          return await batch.commit();
        });*/
        // return Promise.all(
        //     proceduredata['Table 1'].forEach(async (proc: rawprocedure) => {
        //         let batch = this.db.firestore.batch();
        //
        //         let procedurecategory = this.procedurecategories.value.find(cat => {
        //             return cat.name.toLowerCase() == proc.Type.toLocaleLowerCase();
        //         });
        //         let subcategories = procedurecategory.subcategories;
        //         let belongingcategory = Object.entries(subcategories || {}).find((val) => {
        //             if (val) {
        //                 if (proc.SubCategoty) {
        //                     return val[1].name.toLocaleLowerCase() === proc.SubCategoty.toLocaleLowerCase();
        //                 } else {
        //                     if (proc.Category) {
        //                         return val[1].name.toLocaleLowerCase() === proc.Category.toLocaleLowerCase();
        //                     } else {
        //                         console.log('This procedure does not belong to any category');
        //                         return false;
        //                     }
        //                 }
        //             }
        //         });
        //         let newprocedure: RawProcedure = {
        //             pricing: {
        //                 max: Number(proc.Maximum) || null,
        //                 min: Number(proc.Minimum) || null
        //             },
        //             category: {
        //                 id: procedurecategory.id,
        //                 subcategoryid: belongingcategory ? belongingcategory[0] : null,
        //                 code: proc.Code || null
        //             },
        //             numericid: Number(proc.NUMERICID) || null,
        //             id: null,
        //             name: proc.Name ? proc.Name.toLowerCase() : ''
        //         };
        //         console.log(newprocedure);
        //         batch.set(this.db.firestore.collection('procedures').doc(this.db.createId()), newprocedure);
        //         return await batch.commit();
        //     })).then(() => {
        //     this.notificationservice.notify({
        //         alert_type: 'success',
        //         body: 'Procedures added',
        //         title: 'Success',
        //         placement: 'center'
        //     });
        // });
    }

    addcustomprocedure(customprocedure: CustomProcedure): Promise<any> {
        customprocedure.hospitalid = this.activehospital.id;
        customprocedure.status = true;
        customprocedure.creatorid = this.userdata.id;
        customprocedure.metadata = {
            lastedit: Timestamp.now(),
            date: Timestamp.now()
        };
        /**
         * remove insurance prices set to 0
         */
        Object.keys(customprocedure.insuranceprices).forEach(key => {
            if (customprocedure.insuranceprices[key] === 0 || customprocedure.insuranceprices[key] === null) {
                delete customprocedure.insuranceprices[key];
            }
        });
        return this.db.firestore.collection('procedureconfigs').add(customprocedure);
    }

    editcustomprocedure(customprocedure: CustomProcedure): Promise<any> {
        customprocedure.creatorid = this.userdata.id;
        customprocedure.metadata = {
            lastedit: Timestamp.now(),
            date: customprocedure.metadata.date
        };
        /**
         * remove insurance prices set to 0
         */
        Object.keys(customprocedure.insuranceprices).forEach(key => {
            if (!customprocedure.insuranceprices[key] || customprocedure.insuranceprices[key] === 0 || customprocedure.insuranceprices[key] === null) {
                delete customprocedure.insuranceprices[key];
            }
        });
        return this.db.firestore.collection('procedureconfigs').doc(customprocedure.id).update(customprocedure);
    }

    deactivateprocedure(procedureid: string): Promise<any> {

        return this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('procedures').doc(procedureid).delete();
    }
}
