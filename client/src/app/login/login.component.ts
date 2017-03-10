import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  
  userService:UserService;
  username:string;
  password:string;
  message:string;

  constructor(injector:Injector, private router: Router) { 
    this.userService = injector.get(UserService);
    this.message = "";
  }

  login(){
    this.message = "";
    this.userService.logIn(this.username, this.password)
      .subscribe(user => {
          if (Object.keys(user).length === 0){
            this.userService.setCurrentUser(this.username);
            this.router.navigateByUrl('/songdisplay');
          }
          this.message = user;
      })
  }
  
  ngOnInit() {
    this.userService.logOut();
  }

}