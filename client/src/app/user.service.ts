import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable()

export class UserService {
    
    constructor(private http:Http) { }
    
    getCurrentUser() : string {
        var name:string = "user=";
        // Get name portion of cookie
        let ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }
    
    setCurrentUser(name:string) : void {
        var d:Date = new Date();
        d.setTime(d.getTime() + (24*60*60*1000));
        var expires:string = "expires="+d.toUTCString();
        document.cookie = "user=" + name + ";" + expires + ";path=/";
    }
    
    private extractData(res: Response) {
        let body;
        // check if empty, before call json
        if (res.text()) {
            body = res.json();
        }
        return body || {};
    }

    
    createUserInDB(username:string, password:string){
        //create user in db
        var user = {
            'user': username,
            'pass': password
        }
        return this.http.post('/api/register', user)
            .map(this.extractData);
    }
    
    
    logOut(){
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }
    
    
    logIn(username : string, password : string){
        var user = {
            'user': username,
            'pass': password
        }
        return this.http.post('/api/login', user)
            .map(this.extractData);
    }
}
