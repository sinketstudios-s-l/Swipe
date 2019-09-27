import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  userRole
  userName

  mainUser
  subUser
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afs: AngularFirestore,
    private userSvc: UserService
  ) {
    this.initializeApp();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {

        this.mainUser = this.afs.doc(`users/${user.uid}`)
        this.subUser = this.mainUser.valueChanges().subscribe(event => {
          this.userName = event.name
          this.userRole = event.role
        })
      }
    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  logout() {
    this.userSvc.logout()
  }
}
