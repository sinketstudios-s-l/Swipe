import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private afAuth: AngularFireAuth
  ) { }


  emailSignUp(email: string, passwd: string) {

    

  }

}
