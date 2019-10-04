import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeRewardVideo, AdMobFreeRewardVideoConfig, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {
  rewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: false,
    autoShow: true,
    id: ""
  }

  
  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: false,
    autoShow:true,
    id: ""
  }

  constructor(
    private adMob: AdMobFree,
    private userSvc: UserService,
    private afs: AngularFirestore,
    private platform: Platform
  ) { 

    if(this.platform.is('ios')){
      
      this.rewardVideoConfig.id = "ca-app-pub-3993710682934611/1349825671"
      this.bannerConfig.id = "ca-app-pub-3993710682934611/9224446268"

    } else if (platform.is('android')){

      this.rewardVideoConfig.id = "ca-app-pub-3993710682934611/1201769407"
      this.bannerConfig.id = "ca-app-pub-3993710682934611/8150321138"

    }

  }


  banner(){

    this.adMob.banner.config(this.bannerConfig)

    this.adMob.banner.prepare()
    .then(ev => {
      console.log(ev)
    }).catch (err => console.log(err))

  }

  reward(diamonds: number){

    let dms = diamonds

    this.adMob.rewardVideo.config(this.rewardVideoConfig)

    this.adMob.rewardVideo.prepare()
    .then(() => {

      document.addEventListener("admob.rewardvideo.events.REWARD", (event) => {


        console.log("User watched entire ad" + event);

        this.afs.doc(`users/${this.userSvc.getUID()}`).update({
          diamonds: dms+10
        })

        //user watched the ad. REWARD THEM HERE


      });

    }).catch ()

  }

  hideAd(){
    this.adMob.banner.hide()
  }

  showAd(){
    this.adMob.banner.show()
  }


}
