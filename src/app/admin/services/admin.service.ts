import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {emptyadmin, HospitalAdmin} from '../../models/HospitalAdmin';
import {NotificationService} from '../../shared/services/notifications.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    observableuserdata = new ReplaySubject(1);
    userdata: HospitalAdmin = emptyadmin;
    activeurl: string = null;
    firstlogin: boolean = false;
    validuser: boolean;

    constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router, private notificationservice: NotificationService) {
        this.router.events.subscribe((route) => {
            this.activeurl = route['url'];
            // console.log(this.activeurl)
            // console.log(firebase.firestore.FieldValue.serverTimestamp())
        });
        afAuth.authState.subscribe((state) => {
            if (state) {
                // console.log('Logged In')
                // Shows that user is logged in but not in the system hence no data(yet) within the object
                // this.observableuserdata.next(true)

                this.getuser(afAuth.auth.currentUser);
            } else {
                console.log('Logged out');
                this.userdata = emptyadmin;
                this.observableuserdata.next(false);
            }
        });
    }

    // The the status of the activeadmin
    setstatus(availability: number) {
        let config = this.userdata.config;
        config.availability = availability;
        this.db.firestore.collection('hospitaladmins').doc(this.userdata.data.uid).update({config: config});
    }

    getuser(user) {
        this.db.firestore.collection('hospitaladmins').doc(user.uid)
            .onSnapshot(userdata => {
                if (userdata.exists) {
                    // console.log(userdata.data());
                    let temp = userdata.data() as HospitalAdmin;
                    temp.id = userdata.id;

                    if (temp['config']['availability'] == null) {
                        let config = temp['config'];
                        config['availability'] = 2;
                        this.db.firestore.collection('hospitaladmins').doc(user.uid).update({config: config});
                    }
                    // this.userdata = this.objectassign(temp, emptyadmin)
                    this.userdata = emptyadmin;
                    Object.assign(this.userdata, temp);

                    // this.showNotification('success', `Welcome ${user.displayName}`, 'bottom', 5000)

                    this.observableuserdata.next(this.userdata);

                } else {
                    this.checkinvite(user);
                    // this.observableuserdata.next(true)
                }

            }, err => {
                console.log(`Encountered error: ${err}`);
            });
    }

    checkinvite(user: firebase.User) {
        let invitequery = this.db.firestore.collection('admininvites')
            .where('data.email', '==', user.email)
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
                        //Update the details for the first time the user logs in
                        let dataobject = {};
                        dataobject = {};
                        dataobject['email'] = user.email;
                        dataobject['uid'] = user.uid;
                        dataobject['photoURL'] = user.photoURL;
                        dataobject['displayName'] = user.displayName;
                        let copy = docdata.data();
                        copy.data = dataobject;
                        this.db.firestore.collection(`hospitaladmins`).doc(user.uid).set(copy).then(result => {
                            if (this.activeurl == '/authentication/signin') {
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


    createinvite(userdata: HospitalAdmin) {
        return this.afAuth.auth.sendSignInLinkToEmail(userdata.data.email, {
            handleCodeInApp: true,
            url: 'https://mzurihealth.firebaseapp.com/authentication/signin'
        }).then((success) => {
            this.db.firestore.collection('admininvites').add(userdata);
        });

    }
}
