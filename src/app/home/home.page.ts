import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, MenuController, Platform } from '@ionic/angular';
import { DiamondsPage } from '../components/diamonds/diamonds.page';
import { AdMobService } from '../services/ad-mob.service';
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainUser
  subUser

  mainProf
  subProf
  
  profPic
  profName

  name
  diamonds
  
  constructor(
    private userSvc: UserService,
    private router: Router,
    private afs: AngularFirestore,
    private popOverCtrl: PopoverController,
    private menuCtrl: MenuController,
    private platform: Platform,
    private adMobSvc: AdMobService,
    private fcm: FCM
  ) { }


  ngOnInit() {

    if (!this.userSvc.isAuthenticated()) {
      this.router.navigate(['/login'])
    } else {

      this.platform.ready().then(() => {
        this.adMobSvc.banner()

        this.fcm.getToken().then(token => {
          console.log("*============= TOKEN =============*")

          console.log(token)

          console.log("*=================================*")

        });

        // USER 
        this.mainUser = this.afs.doc(`users/${this.userSvc.getUID()}`)
        this.subUser = this.mainUser.valueChanges().subscribe(ev => {
          this.name = ev.name
          this.diamonds = ev.diamonds
  
          if(this.diamonds >= 1000 && this.diamonds <= 9999){
            this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 1) + '.' + Number(this.diamonds).toFixed(0).substr(1, 3)
          }else if(this.diamonds >= 10000 && this.diamonds <= 99999){
            this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 2) + ' k'
          } else if(this.diamonds >= 100000){
            this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 3) + ' k'
          }
        })

        // END USER

        // PROFILES

        this.mainProf = this.afs.collection(`users`)
        this.subProf = this.mainProf.valueChanges().subscribe(p => {
          this.profName = p.name
        })

      })


    }

  }

  async diamondsPop(){
    const diamonds = await this.popOverCtrl.create({
      component: DiamondsPage,
      cssClass: 'diamondsPopOver',
      translucent: true
    })
    await diamonds.present()
  }


  openMenu(){
    this.menuCtrl.enable(true, 'main')
    this.menuCtrl.open('main')
  }

  logout() {
    this.userSvc.logout()
  }

}
