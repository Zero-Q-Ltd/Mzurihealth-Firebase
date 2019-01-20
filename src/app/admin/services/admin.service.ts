import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {emptyadmin, HospitalAdmin} from '../../models/HospitalAdmin';
import {NotificationService} from '../../shared/services/notifications.service';
import {AdminCategory} from '../../models/AdminCategory';
import {AdminInvite} from '../../models/AdminInvite';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    observableuserdata: ReplaySubject<HospitalAdmin> = new ReplaySubject(1);
    userdata: HospitalAdmin = emptyadmin;
    activeurl: string = null;
    firstlogin = false;
    validuser: boolean;
    admincategories: BehaviorSubject<Array<AdminCategory>> = new BehaviorSubject<Array<AdminCategory>>([]);

    constructor(private afAuth: AngularFireAuth, private db: AngularFirestore,
                private router: Router,
                private notificationservice: NotificationService) {
        afAuth.authState.subscribe((state) => {
            if (state) {
                // console.log('Logged In')
                this.getuser(afAuth.auth.currentUser);
            } else {
                console.log('Logged out');
                this.userdata = emptyadmin;
                this.observableuserdata.next(null);
            }
        });
    }

    // The the status of the activeadmin
    setstatus(availability: number): void {
        const config = this.userdata.config;
        config.availability = availability;
        this.db.firestore.collection('hospitaladmins').doc(this.userdata.data.uid).update({config: config});
    }

    getuser(user): void {
        this.db.firestore.collection('hospitaladmins').doc(user.uid)
            .onSnapshot(userdata => {
                if (userdata.exists) {
                    // console.log(userdata.data());
                    const temp = userdata.data() as HospitalAdmin;
                    temp.id = userdata.id;
                    if (!temp.status) {
                        this.observableuserdata.next(null);
                        this.notificationservice.notify({
                            alert_type: 'info',
                            body: 'Your account has been disabled!! Please contact us for more information',
                            title: 'Error!',
                            duration: 10000,
                            icon: '',
                            placement: 'center'
                        });
                    }

                    if (temp['config']['availability'] == null) {
                        const config = temp['config'];
                        config['availability'] = 2;
                        this.db.firestore.collection('hospitaladmins').doc(user.uid).update({config: config});
                    }
                    // this.userdata = this.objectassign(temp, emptyadmin)
                    this.userdata = emptyadmin;
                    Object.assign(this.userdata, temp);

                    // this.showNotification('success', `Welcome ${user.displayName}`, 'bottom', 5000)

                    this.observableuserdata.next(this.userdata);
                    this.getadmincategories();

                } else {
                    this.checkinvite(user);
                    // this.observableuserdata.next(true)
                }

            }, err => {
                console.log(`Encountered error: ${err}`);
            });
    }

    getadmincategories(): void {
        this.db.firestore.collection('admincategories').onSnapshot(allcategorydata => {
            this.admincategories.next(allcategorydata.docs.map(categorydata => {
                const category = categorydata.data() as AdminCategory;
                category.id = categorydata.id;
                return category;
            }));
        });
    }

    disableadmin(adminid: string): Promise<void> {
        return this.db.firestore.collection('hospitaladmins').doc(adminid).update({status: false});
    }

    enableadmin(adminid: string): Promise<void> {
        return this.db.firestore.collection('hospitaladmins').doc(adminid).update({status: true});
    }

    deleteinvite(inviteid: string): Promise<void> {
        return this.db.firestore.collection('admininvites').doc(inviteid).delete();
    }

    initusertypes(): void {
        // admincategorydata.admincategories.forEach(async (category: AdminCategory) => {
        //     const batch = this.db.firestore.batch();
        //     category.name = category.name.toLowerCase();
        //     if (category.subcategories) {
        //         Object.keys(category.subcategories).forEach(key => {
        //             category.subcategories[key].name = category.subcategories[key].name.toLowerCase();
        //             category.subcategories[key].description = category.subcategories[key].description.toLowerCase();
        //         });
        //     }
        //     batch.set(this.db.firestore.collection('admincategories').doc(this.db.createId()), category);
        //     return await batch.commit();
        // });
    }

    checkinvite(user: firebase.User): void {
        const invitequery = this.db.firestore.collection('admininvites')
            .where('email', '==', user.email)
            .limit(1)
            .get().then(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(docdata => {
                        this.firstlogin = true;
                        this.notificationservice.notify({
                            alert_type: 'success',
                            body: 'Welcome ${user.displayName}',
                            title: 'Welcome', duration: 1000,
                            icon: '',
                            placement: 'center'
                        });
                        // Update the details for the first time the user logs in
                        let dataobject = {};
                        dataobject = {};
                        dataobject['email'] = user.email;
                        dataobject['uid'] = user.uid;
                        dataobject['photoURL'] = user.photoURL;
                        dataobject['displayName'] = user.displayName;
                        const copy = docdata.data();
                        copy.data = dataobject;
                        this.db.firestore.collection(`hospitaladmins`).doc(user.uid).set(copy).then(result => {
                            if (this.activeurl === '/authentication/signin') {
                                this.router.navigate(['/dashboard']);
                            }
                        });
                    });
                } else {
                    // console.log('User does not exist!!')
                    this.notificationservice.notify({
                        alert_type: 'error',
                        body: 'You have not registered with any Hospital. Please contactperson us for instrustions',
                        title: 'ERROR', duration: 10000,
                        icon: '',
                        placement: 'center'
                    });
                }
            }, error => {
                console.log('Error verifying invite');
            });
    }


    createinvite(userdata: AdminInvite): Promise<any> {
        return this.afAuth.auth.sendSignInLinkToEmail(userdata.email, {
            handleCodeInApp: true,
            url: 'https://mzurihealth.firebaseapp.com/admin/authentication/signin',
        }).then(() => {
            this.db.firestore.collection('admininvites').add(userdata);
        });

    }
}
