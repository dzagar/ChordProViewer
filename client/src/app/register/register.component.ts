import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {Router} from '@angular/router';
import {Injector} from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  formError:string;
  userService:UserService;
  username:string;
  password:string;
  
  constructor(injector:Injector, private router: Router) {
    this.userService = injector.get(UserService);
    this.formError = "";
  }
  
  createUser(){
    this.formError = "";
    if (!this.username || !this.password || !this.username.replace(/\s+/g, '') || !this.password.replace(/\s+/g, '')){
      this.formError = 'Error: field cannot be blank.';
      return;
    }
    this.userService.createUserInDB(this.username, this.password)
      .subscribe(user => {
        if (Object.keys(user).length === 0){
          this.userService.setCurrentUser(this.username);
          this.router.navigateByUrl('/songdisplay');
        }
        this.formError = user;  
      })
  }

  ngOnInit() {
    this.userService.logOut();
  }

}
