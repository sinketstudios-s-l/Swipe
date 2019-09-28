import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  id
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    this.id = this.navParams.get('id')

  }

  close(){
    this.modalCtrl.dismiss()
  }

}
