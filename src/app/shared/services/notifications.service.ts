import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Howl, Howler } from 'howler';
import {Alert} from '../../models/Alert';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Alert>();

  constructor() {
    this.notificationSubject.subscribe((alert: Alert) => {
      if (alert.alert_type) {
        let config = NotificationService.getsrc(alert);
        const sound = new Howl({
          src: [config.soundsrc]
        });
        alert.icon = alert.icon || config.icon;
        sound.play();
      }
      // const toast = (Swal as any).mixin({
      //   toast: true,
      //   position: alert.duration ? alert.duration : 2000,
      //   showConfirmButton: false,
      //   timer: alert.duration ? alert.duration : 2000
      // });
      // toast({
      //   type: alert.alert_type,
      //   title: alert.title,
      // });
      // this.snackBar.openFromComponent(NotificationComponent, {
      //   duration: alert.duration ? alert.duration : 2000,
      //   data: alert,
      //   panelClass: ['blue-snackbar']
      // });
    });
  }

  private static getsrc(alert: Alert) {
    switch (alert.alert_type) {
      case 'question':
        return {
          icon: 'attach_money',
          soundsrc: '../../../assets/sounds/cash.ogg'
        };
      case 'info':
        return {
          icon: 'info',
          soundsrc: '../../../assets/sounds/drip.ogg'
        };
      case 'success' :
        return {
          icon: 'done_outline',
          soundsrc: '../../../assets/sounds/drums.ogg'
        };
      case 'error':
        return {
          icon: 'error',
          soundsrc: '../../../assets/sounds/sonar.ogg'
        };
      case 'warning':
        return {
          icon: 'warning',
          soundsrc: '../../../assets/sounds/glass.ogg'
        };

    }
  }

  notify(alert: Alert) {
    console.log(alert);
    this.notificationSubject.next(alert);
  }
}
