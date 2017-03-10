import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { ChordEditorService } from '../chord-editor.service';
import {Injector} from '@angular/core';
import {Router} from '@angular/router';

let validator = require('validator');
const screenfull = require('screenfull');

@Component({
  selector: 'app-songdisplay',
  templateUrl: './songdisplay.component.html',
  styleUrls: ['./songdisplay.component.css']
})
export class SongdisplayComponent {

  welcomeMsg : string;
  userService : UserService;
  editorService:ChordEditorService;
  chordList: any[];
  hideme:any;
  isFullscreen:boolean;

  constructor(injector:Injector, private router: Router) { 
    this.userService = injector.get(UserService);
    this.editorService = injector.get(ChordEditorService);
    this.hideme = {};
    this.isFullscreen = false;
    this.welcomeMsg = "Welcome, ";
    
    let user = this.userService.getCurrentUser();
    if (user != ""){
      this.welcomeMsg += user + ".";
    } else {
      this.welcomeMsg += "stranger.";
    }
    
    this.chordList = [];
    this.editorService.getChords() //   Get all chords and map to chordList.
      .subscribe(chords => {
        this.chordList = Object.keys(chords).map(key => chords[key]);
      });
  }
  
  goFullscreen(chordID){    //  Toggle fullscreen of chord.
      var divID = 'view-'+chordID;
      var chordView = document.getElementById(divID);
      
      if(screenfull.enabled){
          screenfull.toggle(chordView);
          this.isFullscreen = screenfull.isFullscreen;
      } else {
          // console.log('Request for fs failed.');
      }
  }
  
  editChord(chordID){   //  Redirect to editor with chordID ready to load.
      this.editorService.setEditorMode(true, chordID);
      this.router.navigateByUrl('/chord-editor');
  }
  
  changePrivacy(chordID){   // Change privacy setting of chord.
      this.editorService.getChordContents(chordID)
      .subscribe(chord => {
        chord.isPrivate = !(chord.isPrivate); //    Set to opposite.
        this.editorService.updatePrivacyChord(chord)    // update chord in database
          .subscribe(resp => {
            // console.log('Updated privacy');
          });
      });
  }
  
  deleteChord(chord){   //  Delete chord from database and view.
    if (confirm('Are you sure you want to delete this chord? This cannot be undone.')){
      this.editorService.deleteChord(chord)
        .subscribe(chordDelete => {
          this.editorService.getChords()    //  Reload updated chord collection into view.
            .subscribe(chords => {
              this.chordList = Object.keys(chords).map(key => chords[key]);
            })
        })
    }
  }
  
  renameChord(chordID){     //  Rename chord (title and title in contents).
    var newName = prompt('Please enter a new name for your chord sheet.');
    
    if (newName){
        if (newName.replace(/\s+/g, '') === ""){
            alert('Error: you must enter a title.');
        } 
        else {
            this.editorService.getChordContents(chordID)
                .subscribe(chord => {
                    chord.title = validator.escape(newName);    //  Sanitize
                    var contentsStr = [];
                    var count = 0;
                    contentsStr[count] = "";    //  Initialize string (avoid undefined)
                    
                    for (var i = 0; i < chord.contents.length; i++){
                        // console.log('first loop ' + i);
                        // console.log('count ' + count);
                        contentsStr[count] += chord.contents.charAt(i);
                        // console.log(contentsStr[count]);
                        if (chord.contents.charAt(i) === '}'){ 
                            count++;
                            contentsStr[count] = "";
                        }
                    }
                    
                    for (var j = 0; j < contentsStr.length; j++){
                        // console.log('second loop '+ j)
                        if(contentsStr[j].includes("{title:") || contentsStr[j].includes("{t:")){
                            chord.contents = chord.contents.replace(contentsStr[j], '\n{title: ' + newName + '}');
                        }
                    }
                    
                    this.editorService.updateChord(chord)   //  Update chord in database.
                        .subscribe(chordUpdate => {
                            this.editorService.getChords()
                                .subscribe(chords => {
                                    this.chordList = Object.keys(chords).map(key => chords[key]);
                                });
                        });
                });
        }
    }
  }
}
