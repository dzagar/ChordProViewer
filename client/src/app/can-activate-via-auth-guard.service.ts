import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';
import {Router} from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuardService implements CanActivate {
  
  userService:UserService;
    
  constructor(injector:Injector, private router:Router) { 
      this.userService = injector.get(UserService);
  }
  
  canActivate(){
      if(!(this.userService.getCurrentUser()==="")){
          return true;
      }
        this.router.navigate(['/home']);
        return false;
  }

}
