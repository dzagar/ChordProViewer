import { Component } from '@angular/core';
import { ChordEditorService } from '../chord-editor.service';
import { UserService } from '../user.service';
import {Injector} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chord-editor',
  templateUrl: './chord-editor.component.html',
  styleUrls: ['./chord-editor.component.css'],
})

export class ChordEditorComponent {
  chords : string[];
  clearWarning : boolean;
  worked : string;
  title: string;
  textbox : string;
  snackBarMsg : string;
  userService: UserService;
  isPrivate : boolean;
  editorService : ChordEditorService;
  
  constructor(injector: Injector, private router:Router) { 
    this.userService = injector.get(UserService);
    this.editorService = injector.get(ChordEditorService);
    this.isPrivate = false;
    if (this.editorService.getEditorMode()){
      this.editorService.getChordContents(this.editorService.getChordEdit())
        .subscribe(chord => {
          this.textbox = chord.contents;
          this.isPrivate = chord.isPrivate;
        })
    }
  }
  
  backToListing(){
    if(confirm('Are you sure you want to leave this page? Any unsaved changes will be lost.')){
      this.router.navigateByUrl('/songdisplay');
    }
  }
  
  onUpload(upload : FileList) : void {
    //Check if correct size, < 1Mb
      let isValid = true;
      let filesize = parseInt(((upload[0].size/1024)/1024).toFixed(4));
      if (filesize > 1){
          //error: cannot be greater than 1mb
          this.snackBarMsg = "Error: File cannot exceed 1Mb in size.";
          isValid = false;
      }
      if (!(upload[0].type === "text/plain")) {
          this.snackBarMsg = "Error: File must be plaintext file (.txt).";
          isValid = false;
      }
    if (isValid){
      var reader = new FileReader();
      let self = this;
      reader.onloadend = function(e){
        self.isPrivate = true;
        self.validateChord(reader.result);
      }
      reader.readAsText(upload[0]);
    }
  }

  clearText() : void {
    if (confirm("Are you sure you want to clear the text area? Your work will not be saved.")){
      this.textbox = "";
    }
  }
  
  createChord() : void {
    let blah = this.textbox;
    this.validateChord(blah);
  }
  
  validateChord(contents: string){
    if (!contents || !contents.trim()) return "Error: cannot save empty chord file.";
    var strArr : string[] = contents.split(/\r?\n/); //Split up into individual lines
    let msg = "";
    let titleCount = 0;
    let title = "";
    var isWarning = false, isError = false;
    for (var i = 0; i < strArr.length; i++){
      let origLine = strArr[i];
      let line = origLine.replace(/\s+/g, ''); //Take spaces out of line
      if (line.charAt(0) === '#') continue;
      if (line.includes("{title:") || line.includes("{t:")){
        let temp = origLine.split(/:(.+)?/);
        title = temp[1].slice(0,-1);
        titleCount++;
      }
      if ((line.includes("{eot") && line != "{eot}") || (line.includes("{end_of_chorus") && line != "{end_of_chorus}")){
        var err = "Error: There can be no extra characters on an eot tag.";
        if (msg){
          msg += " ";
          msg += err;
        }
        else msg = err;
        isError = true;
        //break;
      }
      if ((line.includes("{sot") && line != "{sot}") || (line.includes("{start_of_tab") && line != "{start_of_tab}")){
        var err = "Error: There can be no extra characters on an sot tag.";
        if (msg){
          msg += " ";
          msg += err;
        } 
        else msg = err;
        isError = true;
        //break;
      }
      if ((line.includes("{soc") && line != "{soc}") || (line.includes("{start_of_chorus") && line != "{start_of_chorus}")){
        var err = "Error: There can be no extra characters on an soc tag.";
        if (msg){
          msg += " ";
          msg += err;
        } 
        else msg = err;
        isError = true;
        //break;
      }
      if ((line.includes("{eoc") && line != "{eoc}") || (line.includes("{end_of_chorus") && line != "{end_of_chorus}")){
        var err = "Error: There can be no extra characters on an eoc tag.";
        if (msg){
          msg += " ";
          msg += err;
        } 
        else msg = err;
        isError = true;
        //break;
      }
      if (line.charAt(0) === "{" && line.charAt(line.length-1) != "}"){
        var err = "Error: You need to have a curly brace at the end of the line.";
        if (msg){
          msg += " ";
          msg += err;
        } 
        else msg = err;
        isError = true;
        //break;
      }
      if (line.charAt(line.length-1) === "}" && line.charAt(0) != "{"){
        var err = "Error: You need to have a curly brace at the beginning of the line if you have a curly brace at the end.";
        if (msg){
          msg += " ";
          msg += err;
        } 
        else msg = err;
        isError = true;
        //break;
      }
      for (var j = 0; j < strArr[i].length; j++){
        if (line.charAt(j) === '#') //break;
        if (line.charAt(j) === "{" && j != 0){
          var err = "Error: You cannot have a starting curly brace anywhere other than at the start of the line.";
          if (msg){
            msg += " ";
            msg += err;
          } 
          else msg = err;
          isError = true;
          //break;
        }
        if (line.charAt(j) === "}" && j != line.length-1){ 
          var err = "Error: You cannot have an ending curly brace anywhere other than at the end of the line.";
          if (msg){
            msg += " ";
            msg += err;
          } 
          else msg = err;
          isError = true;
          //break;
        }
        if ((line.includes("{title:") || line.includes("{t:") || line.includes("{subtitle:") || line.includes("{st:") || line.includes("{comment:") || 
        line.includes("{c:") || line.includes("{define:")) &&
        line.charAt(j) === "}"){
          if ((line.charAt(j-1) === ":") && (j-1 === line.indexOf(":"))){
            var err = "Error: You cannot have an empty identifier.";
            if (msg){
              msg += " ";
              msg += err;
            } 
            else msg = err;
            isError = true;
            //break;
          }
        }
        if ((origLine.includes("{title") || origLine.includes("{t ") || line.includes("{subtitle") || origLine.includes("{st ") || line.includes("{comment") || 
        origLine.includes("{c ") || line.includes("{define")) &&
        line.charAt(j) === "}"){
          if (!line.includes(":")){
            var err = "Error: You must have a colon (:) after your identifier.";
            if (msg){
              msg += " ";
              msg += err;
            }
            else msg = err;
            isError = true;
            //break;
          }
        }
      }
      if (line.includes("{define:")){
        var defineParams = origLine.substring(origLine.indexOf(":")+1, origLine.length-1);
        defineParams = defineParams.trim();
        var res = defineParams.split(" ");
        if (res.length != 2){
          var warning = "Warning: Define parameters must have one space between them (ignored).";
          if (msg){
              msg += " ";
              msg += warning;
            }
          else msg = warning;
          isWarning = true;
        }
        res[0] = res[0].replace(/\s+/g, '');
        res[1] = res[1].replace(/\s+/g, '');
        var regexCharName = new RegExp("[A-G]");
        var regexCharCode = new RegExp("[xX]");
        var regexNum = new RegExp("[0-9]");
        if (!res[0].charAt(0).match(regexCharName)){
          var warning = "Warning: Define name parameter must be A-G (ignored).";
          if (msg){
              msg += " ";
              msg += warning;
            }
          else msg = warning;
          isWarning = true;
        }
        if (res[1].length != 6){
          var warning = "Warning: Define code parameter must be 6 characters in length.";
          if (msg){
              msg += " ";
              msg += warning;
            }
          else msg = warning;
          isWarning = true;
        }
        for(var i = 0; i < res[1].length; i++){
          if (!res[1].charAt(i).match(regexCharCode) && !res[1].charAt(i).match(regexNum)){
            var warning = "Warning: Define code parameter cannot contain characters other than X, x, 0-9 (ignored).";
            if (msg){
              msg += " ";
              msg += warning;
            }
            else msg = warning;
            isWarning = true;
          }
        }
      }
      if (line.includes('{') && line.includes('}')){
        var directive = "";
        if (line.includes(':')){
          directive = line.substr(line.indexOf('{')+1, line.indexOf(':')-1);
        }
        else {
          directive = line.substr(line.indexOf('{')+1, line.indexOf('}')-1);
        }
        if (!(directive === "t" || directive === "title" || directive === "st" || directive === "subtitle" || directive === "c" || 
        directive === "comment" || directive === "start_of_chorus" || directive === "soc" || directive === "end_of_chorus" || 
        directive === "eoc" || directive === "start_of_tab" || directive === "sot" || directive === "end_of_tab" || 
        directive === "eot" || directive === "define" || directive === "ns" || directive === "new_song")){
          var warning = "Warning: " + directive + " parameter not supported (ignored).";
          if (msg){
              msg += " ";
              msg += warning;
            }
          else msg = warning;
          isWarning = true;
        }
      }
    }
    if (titleCount > 1){
        var err = "Error: You cannot have more than one title.";
        if (msg){
          msg += " ";
          msg += err;
        }
        else msg = err;
        isError = true;
        //break;
      }
      else if (titleCount < 1){
        var err = "Error: You must have a title.";
        if (msg){
          msg += " ";
          msg += err;
        }
        else msg = err;
        isError = true;
        //break;
      }
    if (!isError){
      var newChord = {
        'title': title,
        'user': this.userService.getCurrentUser(),
        'contents': contents,
        'isPrivate': this.isPrivate
      }
      this.editorService.addChord(newChord)
        .subscribe(chord => {
          if (chord.message == "Chord file saved successfully!" && isWarning)
            this.snackBarMsg = msg + " Saved successfully!";
          else  
            this.snackBarMsg = chord.message;
          this.isPrivate = false;
          this.snackBar();
        });
    } else {
      this.snackBarMsg = msg;
      this.snackBar();
      this.isPrivate = false;
    }
  }
  
  
  snackBar() : void {
    var x = document.getElementById("snackBar");
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  
  ngOnDestroy(){
    this.editorService.setEditorMode(false);
  }

}
