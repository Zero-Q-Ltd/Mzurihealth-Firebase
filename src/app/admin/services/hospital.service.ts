import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AdminService} from './admin.service';
import {BehaviorSubject} from 'rxjs';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {emptyhospital, Hospital} from '../../models/Hospital';

@Injectable({
    providedIn: 'root'
})
export class HospitalService {
    hospitaladmins: BehaviorSubject<HospitalAdmin[]> = new BehaviorSubject([]);
    activehospital: BehaviorSubject<Hospital> = new BehaviorSubject<Hospital>(emptyhospital);
    userdata: HospitalAdmin;
    hospitalerror: boolean;

    constructor(private db: AngularFirestore, private adminservice: AdminService) {
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.id) {
                this.userdata = admin;
                this.gethospitaldetails();
            }
        });

    }

    gethospitaladmins() {
        //Clear the array before fetching
        // console.log(this.activehospital.admins)
        this.db.firestore.collection('hospitaladmins')
            .where('config.hospitalid', '==', this.activehospital.value.id)
            .onSnapshot(hospitaladmindocs => {
                this.hospitaladmins.next(hospitaladmindocs.docs.map(hospitaladmin => {
                    let admin = hospitaladmin.data() as HospitalAdmin;
                    admin.id = hospitaladmin.id;
                    return admin;
                }));
            });
    }

    savehospitalchanges() {
        return this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid).set(this.activehospital);
    }

    gethospitaldetails() {

        this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid)
            .onSnapshot(hospitaldata => {
                if (hospitaldata.exists) {
                    let temp: Hospital = hospitaldata.data() as Hospital;
                    temp.id = hospitaldata.id;
                    this.activehospital.next(temp);
                    //Update Admins if data changes when the user is in the admins page
                    // this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid).collection('admins').doc(this.userdata.data.uid).set({status : true})

                    if (this.adminservice.firstlogin) {
                        this.adminservice.firstlogin = false;
                        //Update the list of admins after first time login
                        this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid).collection('admins').doc(this.userdata.data.uid).set({status: true});
                    }
                    this.gethospitaladmins();
                } else {
                    // this.showNotification('error', 'The associated Clinic has been deleted. Please contact us for instrustions', 'bottom', 5000);
                    // this.afAuth.auth.signOut();
                    // this.router.navigate(['//authentication/signin']);
                }
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
    }
}
