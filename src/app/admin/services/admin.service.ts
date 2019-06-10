import {Injectable} from '@angular/core';
import {BehaviorSubject, ReplaySubject} from 'rxjs';
import {Router} from '@angular/router';
import {emptyadmin, HospitalAdmin} from '../../models/user/HospitalAdmin';
import {NotificationService} from '../../shared/services/notifications.service';
import {AdminCategory} from '../../models/user/AdminCategory';
import {AdminInvite} from '../../models/user/AdminInvite';
import {StitchService} from './stitch/stitch.service';
import {
    AnonymousCredential,
    GoogleRedirectCredential,
    RemoteMongoClient,
    RemoteMongoDatabase,
    Stitch,
    StitchAppClient,
    StitchAppClientConfiguration,
    StitchAuth,
    StitchUser,
    BSON,
} from 'mongodb-stitch-browser-sdk';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    /**
     * The only source of truth
     */
    observableuserdata: ReplaySubject<HospitalAdmin> = new ReplaySubject(1);
    /**
     * Secondary copy of data to avoid many unnecessary subscriptions
     */
    userdata: HospitalAdmin = emptyadmin;
    activeurl: string = null;
    firstlogin = false;
    validuser: boolean;
    admincategories: BehaviorSubject<Array<AdminCategory>> = new BehaviorSubject<Array<AdminCategory>>([]);

    constructor(private router: Router,
                private notificationservice: NotificationService,
                private stitch: StitchService) {
        this.stitch.user.subscribe(value => {
            this.getuser(value);
        });
        this.observableuserdata.subscribe(value => {
            this.userdata = value;
        });
    }

    // The the status of the activeadmin
    setstatus(availability: number): void {
        const config = this.userdata.config;
        config.availability = availability;

    }

    async getuser(user: StitchUser) {
        this.stitch.db.collection<HospitalAdmin>('hospitaladmins')
            .findOne({_id: new BSON.ObjectId(user.id)})
            .then(userdata => {
                this.observableuserdata.next(userdata);
            });
        const stream = await this.stitch.db.collection<HospitalAdmin>('hospitaladmins')
            .watch([new BSON.ObjectId(user.id)]);
        stream.onNext(data => {
            this.observableuserdata.next(data.fullDocument);
        });
    }

    getadmincategories(): void {
        // this.db.firestore.collection('admincategories').onSnapshot(allcategorydata => {
        //     this.admincategories.next(allcategorydata.docs.map(categorydata => {
        //         const category = categorydata.data() as AdminCategory;
        //         category._id = categorydata._id;
        //         return category;
        //     }));
        // });
    }

    disableadmin(adminid: string): any {
        // return this.db.firestore.collection('hospitaladmins').doc(adminid).update({status: false});
    }

    enableadmin(adminid: string): any {
        // return this.db.firestore.collection('hospitaladmins').doc(adminid).update({status: true});
    }

    deleteinvite(inviteid: string): any {
        // return this.db.firestore.collection('admininvites').doc(inviteid).delete();
    }

    signout(): void {
        // this.afAuth.auth.signOut();
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

    logout(): void {
        // this.afAuth.auth.signOut();
        this.router.navigate(['/admin/authentication/login']);
    }

    checkinvite(user: StitchUser): void {
        // const invitequery = this.db.firestore.collection('admininvites')
        // .where('email', '==', user.email)
        // .limit(1)
        // .get().then(snapshot => {
        //     if (!snapshot.empty) {
        //         const invite = snapshot.docs[0].data() as AdminInvite;
        //         const newadmin: HospitalAdmin = {
        //             _id: user.uid,
        //             data: {
        //                 displayName: user.displayName,
        //                 email: user.email,
        //                 photoURL: user.photoURL,
        //                 uid: user.uid
        //             },
        //             profiledata: {
        //                 phone: '',
        //                 address: '',
        //                 age: '',
        //                 bio: '',
        //                 status: null
        //             },
        //             config: {
        //                 level: invite.level,
        //                 categoryid: invite.categoyid,
        //                 availability: 1,
        //                 hospitalid: invite.hospitalid
        //             },
        //             status: true,
        //             metadata: {
        //                 date: firestore.Timestamp.now(),
        //                 lastedit: firestore.Timestamp.now()
        //             }
        //         };
        //         this.db.firestore.collection(`hospitaladmins`).doc(user.uid).set(newadmin).then(result => {
        //             this.db.firestore.collection(`admininvites`).doc(snapshot.docs[0]._id).delete();
        //             if (this.activeurl === '/authentication/signin') {
        //                 this.router.navigate(['/dashboard']);
        //             }
        //         });
        //     } else {
        //         // console.log('User does not exist!!')
        //         this.notificationservice.notify({
        //             alert_type: 'error',
        //             body: 'You have not registered with any Hospital. Please contactperson us for instrustions',
        //             title: 'ERROR', duration: 10000,
        //             icon: '',
        //             placement: {
        //                 vertical: 'top',
        //                 horizontal: 'center'
        //             }
        //         });
        //     }
        // }, error => {
        //     console.log('Error verifying invite');
        // });
    }


    createinvite(userdata: AdminInvite): any {
        // return this.afAuth.auth.sendSignInLinkToEmail(userdata.email, {
        //     handleCodeInApp: true,
        //     url: 'https://mzurihealth.firebaseapp.com/admin/authentication/signin',
        // }).then(() => {
        //     this.db.firestore.collection('admininvites').add(userdata);
        // });

    }
}
