import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {BehaviorSubject} from 'rxjs';
import {Hospital} from '../../models/Hospital';
import {RawProcedure} from '../../models/RawProcedure';
import {CustomProcedure} from '../../models/CustomProcedure';
import {ProcedureCategory} from '../../models/ProcedureCategory';
import {NotificationService} from '../../shared/services/notifications.service';

@Injectable({
    providedIn: 'root'
})
export class ProceduresService {
    hospitalprocedures: Map<string, { procedure: CustomProcedure, procedureconfig?: RawProcedure }> = new Map();
    activehospital: Hospital;
    procedurecategories: BehaviorSubject<Array<ProcedureCategory>> = new BehaviorSubject<Array<ProcedureCategory>>([]);

    constructor(private db: AngularFirestore, private hospitalservice: HospitalService, private notificationservice: NotificationService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.getprocedures();
                this.getprocedurecategories();
            }
        });
    }

    getprocedures() {
        Object.keys(this.activehospital.procedures).forEach(key => {
            this.db.firestore.collection('procedures').doc(key)
                .onSnapshot(procedure => {
                    //Reset all the procedures when a the list changess
                    if (procedure.exists) {
                        this.hospitalprocedures.clear;
                        let temp = procedure.data() as CustomProcedure;
                        temp['refid'] = procedure.id;
                        this.db.firestore.collection('procedures').doc(key).collection('hospitalconfigs').doc(this.activehospital.id)
                            .onSnapshot(procedureconfig => {
                                if (procedureconfig.exists) {
                                    this.hospitalprocedures.set(key, {
                                        procedure: Object.assign({}, temp),
                                        procedureconfig: Object.assign({}, procedureconfig.data() as RawProcedure)
                                    });
                                } else {
                                    this.hospitalprocedures.set(key, {procedure: Object.assign({}, temp)});
                                }
                                // console.log(this.hospitalprocedures)
                            });
                    }
                }, err => {
                    console.log(`Encountered error: ${err}`);
                });
        });

    }

    fetchproceduresincategory(categoryid: string) {
        return this.db.firestore.collection('procedures').where('category.id', '==', categoryid);
    }

    getprocedurecategories() {
        this.db.firestore.collection('procedurecategories').orderBy('name', 'asc').onSnapshot(rawdocs => {
            this.procedurecategories.next(rawdocs.docs.map(rawdoc => {
                let procedurecategory: ProcedureCategory = rawdoc.data() as ProcedureCategory;
                procedurecategory.id = rawdoc.id;
                return procedurecategory;
            }));
            // console.log('done fetching ');
        });
    }

    syncprocedures() {
        interface rawprocedure {
            'CODE': string,
            'Name': string,
            'Minimum': string,
            'Maximum': string,
            'Type': string,
            'Category': string,
            'Code': string,
            'SubCategoty': string
        }

        /**
         * In case you ever need to rewrite the categories again, make sure to also rewrite the procedures as new ids will be assigned
         * also remember to add the import statement for the json
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
        /*   return Promise.all(
             proceduredata['Table 1'].forEach(async (proc: rawprocedure) => {
               let batch = this.db.firestore.batch();

               let procedurecategory = this.procedurecategories.value.find(cat => {
                 return cat.name.toLofwerCase() == proc.Type.toLocaleLowerCase();
               });
               let subcategories = procedurecategory.subcategories;
               let belongingcategory = Object.entries(subcategories || {}).find((val) => {
                 if (val) {
                   if (proc.SubCategoty) {
                     return val[1].name.toLocaleLowerCase() === proc.SubCategoty.toLocaleLowerCase();
                   } else {
                     if (proc.Category) {
                       return val[1].name.toLocaleLowerCase() === proc.Category.toLocaleLowerCase();
                     } else {
                       console.log('This procedure does not belong to any category');
                       return false;
                     }
                   }
                 }
               });
               let newprocedure: RawProcedure = {
                 pricing: {
                   max: proc.Maximum || null,
                   min: proc.Minimum || null
                 },
                 category: {
                   id: procedurecategory.id,
                   subcategoryid: belongingcategory ? Number(belongingcategory[0]) : null,
                   code: proc.Code || null
                 },
                 id: null,
                 name: proc.Name ? proc.Name.toLowerCase() : ''
               };
               console.log(newprocedure);
               batch.set(this.db.firestore.collection('procedures').doc(this.db.createId()), newprocedure);
               return await batch.commit();
             })).then(() => {
             this.notificationservice.notify({
               alert_type: 'success',
               body: 'Procedures added',
               title: 'Success',
               placement: 'center'
             });
           });*/
    }

    addprocedure(procedureconfig: RawProcedure, tempprocedure) {
        //For lack or a better method:
        let procedureid = this.db.createId();
        // console.log(procedureconfig, tempprocedure)
        let batch = this.db.firestore.batch();
        this.activehospital.procedures[procedureid] = 1;
        //Update the hospital and assign that procedure to its list
        batch.set(this.db.firestore.collection('hospitals').doc(this.activehospital.id), this.activehospital);
        //Add the procedure to all procedures list
        batch.set(this.db.firestore.collection('procedures').doc(procedureid), tempprocedure);
        //Add the clinic procedure config to its unique id within the procedures/hospitalconfigs
        batch.set(this.db.firestore.collection('procedures').doc(procedureid).collection('hospitalconfigs').doc(this.activehospital.id), procedureconfig);
        return batch.commit();
    }

    deleteprocedure(procedureid: string) {

        return this.db.firestore.collection('hospitals').doc(this.activehospital.id).collection('procedures').doc(procedureid).delete();
    }
}
