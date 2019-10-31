import { Component } from '@angular/core';

import { Platform, ModalController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './services/user.service';
import { MenuPage } from './modals/menu/menu.page';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';

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

  token
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afs: AngularFirestore,
    private userSvc: UserService,
    private modalCtrl: ModalController,
    private router: Router,
    private menuCtrl: MenuController,
    private fcm: FCM
  ) {
    this.initializeApp();

    fcm.getToken().then(token => this.token = token)

    localStorage.setItem('token', this.token)

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
      this.statusBar.styleLightContent()
      this.splashScreen.hide();
    });
  }


  logout() {
    this.userSvc.logout()
  }
  chat(){
    this.router.navigate(['chats']).finally(() => this.menuCtrl.close())
  }
  async menu(e){
    let id = e.target.id

    const modal = await this.modalCtrl.create({
      component: MenuPage,
      componentProps: {
        id: id
      }
    })
    await modal.present()
  }
}
