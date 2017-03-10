import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Injector } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  userService:UserService;
  
  constructor(injector:Injector, private router:Router){
    this.userService = injector.get(UserService);
  }
  
  checkIfPrivate(){
    return !(this.userService.getCurrentUser() === "");
  }
  
}
