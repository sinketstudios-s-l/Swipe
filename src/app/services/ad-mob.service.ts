import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeRewardVideo, AdMobFreeRewardVideoConfig, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {

  rewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: true,
    autoShow: true,
    id: "ca-app-pub-3993710682934611/1349825671"
  }

  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: true,
    autoShow:true,
    id: "ca-app-pub-3993710682934611/9224446268"
  }

  constructor(
    private adMob: AdMobFree
  ) { }


  banner(){

    this.adMob.banner.config(this.bannerConfig)

    this.adMob.banner.prepare()
    .then(ev => {
      console.log(ev)
    }).catch (err => console.log(err))

  }

  reward(){

    this.adMob.rewardVideo.config(this.rewardVideoConfig)

    this.adMob.rewardVideo.prepare()
    .then(ev => {
      console.log(ev)
    }).catch (err => console.log(err))

  }


}
