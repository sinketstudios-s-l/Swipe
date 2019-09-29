import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AdMobService } from 'src/app/services/ad-mob.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  @ViewChild('profileSlider', { static: true }) profileSlider;
  id
  mainComp
  subComp
  img
  name
  age
  role
  verificated

  sliderOpts = {
    direction: "vertical",
    slidesPerView: 1,
    initialSlide: 0,

  }
  constructor(
    private navParams: NavParams,
    private afs: AngularFirestore,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private userSvc: UserService,
    private adMobSvc: AdMobService
  ) {
    this.statusBar.hide()
    this.adMobSvc.hideAd()
  }

  ngOnInit() {

    var newIndex = this.profileSlider.activeIndex

    var slide = this.profileSlider.realIndex
    console.log(slide)

    this.id = this.navParams.get('id')

    this.mainComp = this.afs.doc(`users/${this.id}`)
    this.subComp = this.mainComp.valueChanges().subscribe(ev => {

      this.img = ev.profilePic
      this.name = ev.name
      this.role = ev.role
      this.verificated = ev.verificated



      const afsTMSP = ev.age.toDate().getFullYear()
      const now = new Date().getFullYear()
      this.age = now - afsTMSP



    })
  }

  close() {
    this.modalCtrl.dismiss().then(() => {
      this.statusBar.show()
      this.adMobSvc.showAd()
    })
  }
}
