import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

let chordpro = require('chordprojs');

@Injectable()

export class ChordEditorService {
  
  editorMode:boolean;
  currentChordEdit:string;
  
  constructor(private http : Http) { 
    this.editorMode = false;
    this.currentChordEdit = "";
  }
  
  
  getChordEdit():string{    //  Get chord to be edited.
    return this.currentChordEdit;
  }
  
  
  getEditorMode():boolean{    //  Get if in editor mode or not.
    return this.editorMode;
  }
  
  
  setEditorMode(boolie:boolean, chordID:string = ""){   //  Set editor mode and chord to edit.
    this.editorMode = boolie;
    this.currentChordEdit = chordID;
  }
  
  
  addChord(newChord){   //  Add chord to database.
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/chord-editor', JSON.stringify(newChord), {headers: headers})
      .map(res => res.json());
  }
  
  
  getChords(){    //  Get all chords.
    return this.http.get('/api/songdisplay')
      .map(res => res.json());
  }
  
  
  getChordContents(chordID){    //  Get one chord.
    return this.http.get('/api/chord-editor/' + chordID)
      .map(res => res.json());
  }
  
  
  convertChordPro(chord){   //  Convert to ChordPro using chordprojs.
    var parseResult = chordpro.parse(chord.contents);
    var formatResult = chordpro.formatParseResult(parseResult);
    return formatResult.html;
  }
  
  
  deleteChord(chordID){   //  Delete one chord.
    return this.http.delete('/api/chord-editor/' + chordID)
      .map(res => res.json());
  }
  
  
  updateChord(chord){   //  Update one chord (title + contents).
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/songdisplay/' + chord._id, JSON.stringify(chord), {headers: headers})
      .map(res => res.json());
  }
  
  
  updatePrivacyChord(chord){    //  Update one chord (privacy).
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/chord-editor/' + chord._id, JSON.stringify(chord), {headers: headers})
      .map(res => res.json());
  }
}


