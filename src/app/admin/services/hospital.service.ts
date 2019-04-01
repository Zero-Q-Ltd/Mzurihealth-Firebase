import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AdminService} from './admin.service';
import {BehaviorSubject} from 'rxjs';
import {HospitalAdmin} from '../../models/HospitalAdmin';
import {emptyhospital, Hospital} from '../../models/Hospital';
import {AdminInvite, emptyadmininvite} from '../../models/AdminInvite';

@Injectable({
    providedIn: 'root'
})
export class HospitalService {
    hospitaladmins: BehaviorSubject<HospitalAdmin[]> = new BehaviorSubject([]);
    activehospital: BehaviorSubject<Hospital> = new BehaviorSubject<Hospital>({...emptyhospital});
    userdata: HospitalAdmin;
    hospitalerror: boolean;
    invitedadmins: BehaviorSubject<Array<AdminInvite>> = new BehaviorSubject<Array<AdminInvite>>([]);

    constructor(private db: AngularFirestore, private adminservice: AdminService) {
        adminservice.observableuserdata.subscribe((admin: HospitalAdmin) => {
            if (admin.id) {
                this.userdata = admin;
                this.gethospitaldetails();
            }
        });

    }

    gethospitaladmins(): void {
        this.db.firestore.collection('hospitaladmins')
            .where('config.hospitalid', '==', this.activehospital.value.id)
            .onSnapshot(hospitaladmindocs => {
                this.hospitaladmins.next(hospitaladmindocs.docs.map(hospitaladmin => {
                    return Object.assign(hospitaladmin.data() as HospitalAdmin, {id: hospitaladmin.id});
                }));
            });
    }

    getinvitedadmins(): void {
        this.db.firestore.collection('admininvites').where('hospitalid', '==', this.activehospital.value.id).onSnapshot(invitesdata => {
            this.invitedadmins.next(invitesdata.docs.map(inviteedata => {
                return Object.assign(emptyadmininvite, inviteedata.data() as AdminInvite, {id: inviteedata.id});
            }));
        });
    }

    savehospitalchanges(hospital: Hospital): Promise<void> {
        return this.db.firestore.collection('hospitals').doc(hospital.id).set(hospital);
    }

    adminexists(email: string): HospitalAdmin | undefined {
        return this.hospitaladmins.value.find(admin => {
            return admin.data.email === email;
        });
    }


    gethospitaldetails(): void {

        this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid)
            .onSnapshot(hospitaldata => {
                if (hospitaldata.exists) {
                    const temp: Hospital = Object.assign(emptyhospital, hospitaldata.data() as HospitalAdmin, {id: hospitaldata.id});
                    this.activehospital.next(temp);
                    // Update Admins if data changes when the user is in the admins page
                    // this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid).collection('admins').doc(this.userdata.data.uid).set({status : true})

                    if (this.adminservice.firstlogin) {
                        this.adminservice.firstlogin = false;
                        // Update the list of admins after first time login
                        this.db.firestore.collection('hospitals').doc(this.userdata.config.hospitalid).collection('admins').doc(this.userdata.data.uid).set({status: true});
                    }
                    this.gethospitaladmins();
                    this.getinvitedadmins();
                } else {
                    // this.showNotification('error', 'The associated Clinic has been deleted. Please contactperson us for instrustions', 'bottom', 5000);
                    // this.afAuth.auth.signOut();
                    // this.router.navigate(['//authentication/signin']);
                }
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
    }
}
