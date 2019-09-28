import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, MenuController, Platform, ModalController } from '@ionic/angular';
import { DiamondsPage } from '../components/diamonds/diamonds.page';
import { AdMobService } from '../services/ad-mob.service';
import { FCM } from '@ionic-native/fcm/ngx';
import * as firebase from 'firebase'
import { modalController } from '@ionic/core';
import { ViewPage } from '../modals/view/view.page';


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

  id
  constructor(
    private userSvc: UserService,
    private router: Router,
    private afs: AngularFirestore,
    private popOverCtrl: PopoverController,
    private menuCtrl: MenuController,
    private platform: Platform,
    private adMobSvc: AdMobService,
    private fcm: FCM,
    private modalCtrl: ModalController
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
                  this.renderList(doc)
                })
              })
          } else if (this.userInterest === 'male') {
            this.afs.collection('users').ref.where('role', "==", "companion")
              .where('gender', '==', 'male').orderBy('rate', 'desc').get()
              .then((snapshop) => {
                snapshop.docs.forEach(doc => {
                  this.renderList(doc)
                })
              })
          } else if (this.userInterest === 'both') {
            this.afs.collection('users').ref.where('role', "==", "companion")
              .orderBy('rate', 'desc').get()
              .then((snapshop) => {
                snapshop.docs.forEach(doc => {
                  this.renderList(doc)
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

        
      })
    }
  }

  renderList(doc) {
    const compList = document.getElementById('rowList')

    /// TIMESTAMP TO DATE TO AGE CONVERSION ///

    const gender = doc.data().gender
    const afsTMSP = doc.data().age.toDate().getFullYear()
    const now = new Date().getFullYear()
    const age = now - afsTMSP
    
    ///////////////////////////////////////////

    let col = document.createElement('ion-col')
    let gen = document.createElement('ion-icon')
    let card = document.createElement('ion-card')
    let divImg = document.createElement('div')
    let img = document.createElement('img')
    let cardContent = document.createElement('div')
    let name = document.createElement('h6')
    let desc = document.createElement('p')
    
    const verificated = doc.data().verificated

    col.setAttribute('size', '6')
    card.setAttribute('id', doc.id)
    gen.setAttribute('id', doc.id)
    img.setAttribute('id', doc.id)
    cardContent.setAttribute('id', doc.id)
    name.setAttribute('id', doc.id)

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
    cardContent.style.bottom = "0rem"
    cardContent.style.left = "0rem"
    cardContent.style.padding = "10px"
    cardContent.style.width = "100%"
    cardContent.style.verticalAlign = "middle"
    cardContent.style.margin = "0 auto"
    cardContent.style.background = "#000000"
    cardContent.style.background = "-webkit-linear-gradient(to top, #000000bb, #00000000)"
    cardContent.style.background = "linear-gradient(to top, #000000bb, #00000000)"
    name.style.margin = "0"
    desc.style.margin = "0"

    img.src = doc.data().profilePic
    
    if(verificated == true){
      name.innerHTML = name.textContent = doc.data().name+ ', ' + age  + ' ' + '<svg style="fill:white; vertical-align: top;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 509.604 509.604" xml:space="preserve"><g><g><path d="M34.262,333.282c8.119,6.75,14.793,15.223,14.143,20.988c-0.382,3.443-0.593,6.943-0.593,10.5    c0,52.393,41.3,94.861,92.24,94.861c6.292,0,12.431-0.65,18.37-1.885c10.002-2.074,21.812,1.941,28.888,9.793    c16.82,18.646,40.803,30.342,67.492,30.342c28.19,0,53.426-13.016,70.342-33.518c6.723-8.146,18.103-11.533,28.22-8.5    c8.166,2.447,16.811,3.768,25.751,3.768c50.939,0,92.24-42.477,92.24-94.861c0-5.861-0.535-11.59-1.549-17.145    c-1.712-9.371,2.85-21.047,10.471-28.363c18.025-17.289,29.328-41.883,29.328-69.242c0-29.787-13.368-56.323-34.263-73.698    c-8.118-6.751-14.793-15.224-14.143-20.99c0.383-3.442,0.593-6.942,0.593-10.5c0-52.393-41.301-94.86-92.24-94.86    c-6.292,0-12.431,0.65-18.369,1.884c-10.002,2.075-21.812-1.941-28.889-9.792c-16.82-18.647-40.803-30.342-67.492-30.342    c-26.688,0-50.671,11.695-67.492,30.342c-7.076,7.841-18.886,11.867-28.888,9.792c-5.938-1.234-12.078-1.884-18.37-1.884    c-50.939,0-92.24,42.477-92.24,94.86c0,5.049,0.392,10.002,1.147,14.832c1.262,8.128-4.447,18.149-12.747,24.681    C14.219,201.663,0,228.887,0,259.583C0,289.37,13.368,315.907,34.262,333.282z M131.475,263.016    c2.046-3.625,7.268-3.672,12.049,0.479l48.119,33.918c2.61,1.588,5.106,2.4,7.506,2.4c4.963,0,8.893-3.576,12.689-7.02    l153.985-154.138c9.629-10.471,18.99-14.162,25.102-10.146c2.82,1.855,4.646,4.647,5.135,7.87    c0.583,3.825-0.756,7.946-3.768,11.599l-185.149,224.91c-2.687,3.26-6.11,5.059-9.629,5.059c-4.179,0-7.965-2.516-10.404-6.895    l-54.344-97.969C130.519,269.422,130.021,265.618,131.475,263.016z"/></g></g></svg>'
    } else {
      name.textContent = doc.data().name+ ', ' + age
    }

    desc.textContent = "texto de prueba"
    card.addEventListener('click', ev => {
        this.modalView(ev)
    })
    col.appendChild(card)
    card.appendChild(divImg)
    divImg.appendChild(img)
    divImg.appendChild(cardContent)
    divImg.appendChild(gen)
    cardContent.appendChild(name)
    cardContent.appendChild(desc)

    compList.appendChild(col)
  }


  async modalView(e){

    this.id = e.target.id

    const modal = await this.modalCtrl.create({
      component: ViewPage,
      componentProps: {
        id: this.id
      }
    })
    await modal.present()
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
