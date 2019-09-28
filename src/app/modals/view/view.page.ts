import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  id
  mainComp
  subComp
  img
  name

  sliderOpts = {
    direction: "vertical",
    slidesPerView: 1,
    initialSlide: 0
  }
  constructor(
    private navParams: NavParams,
    private afs: AngularFirestore,
    private modalCtrl: ModalController,
    private userSvc: UserService
  ) { }

  ngOnInit() {

    this.id = this.navParams.get('id')

    this.mainComp = this.afs.doc(`users/${this.id}`)
    this.subComp = this.mainComp.valueChanges().subscribe(ev => {

      this.img = ev.profilePic
      this.name = ev.name

    })
  }

  close(){
    this.modalCtrl.dismiss()
  }
}
