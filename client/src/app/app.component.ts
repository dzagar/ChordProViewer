import { Component } from '@angular/core';
import { ChordEditorComponent } from './chord-editor/chord-editor.component';
import { SongdisplayComponent } from './songdisplay/songdisplay.component';
import { UserService } from './user.service';
import { Injector } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  userService:UserService;
  constructor(injector:Injector){
    this.userService = injector.get(UserService);
  }
  
  checkIfPrivate() : boolean {
    return !(this.userService.getCurrentUser() === "");
  }

  
  
}
