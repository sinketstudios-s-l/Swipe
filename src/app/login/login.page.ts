import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('signupSlider', { static: true }) signupSlider;
  slideOpts = {
    initialSlide: 4,
    slidesPerView: 1,
    autoHeight: true,
    allowTouchMove: false,
    speed: 800,

  };
  loginF = 0

  nombre
  dateNow
  dateLimit
  date
  gen
  int

  nameForm: FormGroup
  dateForm: FormGroup
  regForm: FormGroup
  loginForm: FormGroup
  rol: any;

  constructor(
    public formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private userSvc: UserService,
    private router: Router
  ) {



  }

  ngOnInit() {

    if (this.userSvc.isAuthenticated()) {
      this.router.navigate(['/home'])
    }

    this.dateLimit = new Date().getFullYear() - 18


    this.nameForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('[a-zA-Z ]*')
      ]))
    })

    this.dateForm = this.formBuilder.group({
      date: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    })

    this.regForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(4)
      ])),
      passwd: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]))
    })


    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(4)
      ])),
      passwd: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]))
    })
  }


  next() {
    this.nombre = this.nameForm.get('name').value
    this.signupSlider.slideNext()

  }

  prev() {

    this.signupSlider.slidePrev()

  }

  gender(g) {
    this.signupSlider.slideNext()
    this.gen = g.target.id
  }
  interest(i) {
    this.signupSlider.slideNext()
    this.int = i.target.id
  }

  role(r) {
    this.signupSlider.slideNext()
    this.rol = r.target.id
  }

  dateAge() {
    var date = this.dateForm.get('date').value
    console.log(new Date(date))
  }

  logForm() {
    this.loginF = 1
    document.getElementById('regContainer').style.display = "none"
  }
  
  regisForm(){
    this.loginF = 0
    document.getElementById('regContainer').style.display = "block"
  }


  async signup() {

    var name = this.nameForm.get('name').value
    var date = this.dateForm.get('date').value
    var gen = this.gen
    var int = this.int
    var email = this.regForm.get('email').value
    var passwd = this.regForm.get('passwd').value

    try {

      const res = await this.afAuth.auth.createUserWithEmailAndPassword(email, passwd)

      this.afs.doc(`users/${res.user.uid}`).set({
        name,
        email,
        verificated: false,
        date: new Date(),
        age: new Date(date),
        gender: gen,
        interest: int,
        uid: res.user.uid,
        role: this.rol,
        diamonds: Number(300)
      }).then(() => {
        this.router.navigate(['/home']).finally(() => window.location.reload())
      })

      this.userSvc.setUser({
        email,
        uid: res.user.uid
      })

    } catch {

    }


  }

  async signin() {

    var email = this.loginForm.get('email').value
    var passwd = this.loginForm.get('passwd').value

    try {

      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, passwd)

      if (res.user) {
        this.userSvc.setUser({
          email,
          uid: res.user.uid
        })

        this.router.navigate(['/home']).then(() => window.location.reload())
      }
    } catch (err) {
      console.dir(err)
    }

  }


}
