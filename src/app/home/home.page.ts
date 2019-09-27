import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, MenuController, Platform } from '@ionic/angular';
import { DiamondsPage } from '../components/diamonds/diamonds.page';
import { AdMobService } from '../services/ad-mob.service';
import { FCM } from '@ionic-native/fcm/ngx';
import * as firebase from 'firebase'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainUser
  subUser
  userInterest

  mainProf
  subProf

  companions: any[]

  name
  diamonds
  subComp
  mainComp


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
          this.userInterest = ev.interest

          if (this.userInterest === 'female') {
            this.afs.collection('users').ref.where('role', "==", "companion")
              .where('gender', '==', 'female').orderBy('rate', 'desc').get()
              .then((snapshop) => {
                snapshop.docs.forEach(doc => {
                  renderList(doc)
                })
              })
          } else if (this.userInterest === 'male') {
            this.afs.collection('users').ref.where('role', "==", "companion")
              .where('gender', '==', 'male').orderBy('rate', 'desc').get()
              .then((snapshop) => {
                snapshop.docs.forEach(doc => {
                  renderList(doc)
                })
              })
          } else if (this.userInterest === 'both') {
            this.afs.collection('users').ref.where('role', "==", "companion")
              .orderBy('rate', 'desc').get()
              .then((snapshop) => {
                snapshop.docs.forEach(doc => {
                  renderList(doc)
                })
              })
          }

          if (this.diamonds >= 1000 && this.diamonds <= 9999) {
            this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 1) + '.' + Number(this.diamonds).toFixed(0).substr(1, 3)
          } else if (this.diamonds >= 10000 && this.diamonds <= 99999) {
            this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 2) + ' k'
          } else if (this.diamonds >= 100000) {
            this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 3) + ' k'
          }
        })

        // END USER

        const compList = document.getElementById('rowList')
        function renderList(doc) {

          const gender = doc.data().gender

          let col = document.createElement('ion-col')
          let gen = document.createElement('ion-icon')
          let card = document.createElement('ion-card')
          let divImg = document.createElement('div')
          let img = document.createElement('img')
          let cardContent = document.createElement('div')
          let name = document.createElement('h6')


          col.setAttribute('size', '6')
          card.setAttribute('id', doc.id)
          if (gender == 'female') {
            gen.setAttribute('name', 'female')
            gen.setAttribute('mode', 'ios')
            gen.style.color = "#da70d6"
          } else if (gender == 'male') {
            gen.setAttribute('name', 'male')
            gen.setAttribute('mode', 'ios')
            gen.style.color = "#0000ff"
          } else if (gender == 'trans') {
            gen.setAttribute('name', 'transgender')
            gen.setAttribute('mode', 'md')
            gen.style.color = "#a6ff00"
          }

          gen.style.position = "absolute"
          gen.style.top = "1rem"
          gen.style.right = "1rem"
          gen.style.fontSize = "20px"
          card.style.margin = "0"
          card.style.background = "#fff"
          card.style.color = "#fff"
          divImg.style.width = "100%"

          divImg.style.objectFit = "cover"
          divImg.style.position = "relative"
          cardContent.style.position = "absolute"
          cardContent.style.bottom = "2rem"
          cardContent.style.left = "1rem"

          img.src = doc.data().profilePic
          name.textContent = doc.data().name

          col.appendChild(card)
          card.appendChild(divImg)
          divImg.appendChild(img)
          divImg.appendChild(cardContent)
          divImg.appendChild(gen)
          cardContent.appendChild(name)

          compList.appendChild(col)
        }

        // COMPANIONs FOR CYCLE





      })


    }

  }



  async diamondsPop() {
    const diamonds = await this.popOverCtrl.create({
      component: DiamondsPage,
      cssClass: 'diamondsPopOver',
      translucent: true
    })
    await diamonds.present()
  }


  openMenu() {
    this.menuCtrl.enable(true, 'main')
    this.menuCtrl.open('main')
  }

  logout() {
    this.userSvc.logout()
  }

}
