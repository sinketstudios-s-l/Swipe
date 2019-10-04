import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { AdMobService } from 'src/app/services/ad-mob.service';

@Component({
  selector: 'app-diamonds',
  templateUrl: './diamonds.page.html',
  styleUrls: ['./diamonds.page.scss'],
})
export class DiamondsPage implements OnInit {
  subUser: any;
  mainUser: any;
  diamonds: any;

  constructor(
    private afs: AngularFirestore,
    private userSvc: UserService,
    private adMobSvc: AdMobService
  ) { }

  ngOnInit() {

    this.mainUser = this.afs.doc(`users/${this.userSvc.getUID()}`)
    this.subUser = this.mainUser.valueChanges().subscribe(ev => {
      this.diamonds = ev.diamonds
      if(this.diamonds >= 1000 && this.diamonds <= 9999){
        this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 1) + '.' + Number(this.diamonds).toFixed(0).substr(1, 3)
      }else if(this.diamonds >= 10000 && this.diamonds <= 99999){
        this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 2) + ' k'
      } else if(this.diamonds >= 100000){
        this.diamonds = Number(this.diamonds).toFixed(0).substr(0, 3) + ' k'
      }
    })
  }

  diamondsPay(d){

    const id = d.target.id

    console.log(id)

  }

  reward(){
    this.adMobSvc.reward(Number(this.diamonds))
  }

}
