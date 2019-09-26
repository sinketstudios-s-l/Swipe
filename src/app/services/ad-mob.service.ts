import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeRewardVideo, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {

  rewardVideoConfig: AdMobFreeRewardVideoConfig = {
    isTesting: true,
    autoShow: true,
    id: "ca-app-pub-3993710682934611/1349825671"
  }

  constructor(
    private adMob: AdMobFree
  ) { }

  reward(){

    this.adMob.rewardVideo.config(this.rewardVideoConfig)

    this.adMob.rewardVideo.prepare()
    .then(() => {

    }).catch (e => console.log(e))

  }


}
