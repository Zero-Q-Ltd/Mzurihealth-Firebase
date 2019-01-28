import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HospitalService} from './hospital.service';
import {BehaviorSubject} from 'rxjs';
import {emptyinsurance, InsuranceCompany} from '../../models/InsuranceCompany';
import {Hospital} from '../../models/Hospital';

@Injectable({
    providedIn: 'root'
})
export class InsuranceService {
    activehospital: Hospital;
    allinsurance: BehaviorSubject<InsuranceCompany[]> = new BehaviorSubject<InsuranceCompany[]>([]);

    constructor(private db: AngularFirestore, private hospitalservice: HospitalService) {
        this.hospitalservice.activehospital.subscribe(hospital => {
            if (hospital.id) {
                this.activehospital = hospital;
                this.getinsurance();
            }
        });
    }

    getinsurance(): void {
        this.db.firestore.collection('insurance').get().then(snapshot => {
            this.allinsurance.next(snapshot.docs.map(insurancedata => {
                const insurance = Object.assign({}, emptyinsurance, insurancedata.data() as InsuranceCompany);
                insurance.id = insurancedata.id;
                return insurance;
            }));
        });
    }

}
