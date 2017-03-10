import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { routing } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { SongdisplayComponent } from './songdisplay/songdisplay.component';
import { ChordEditorComponent } from './chord-editor/chord-editor.component';
import { ChordEditorService } from './chord-editor.service';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './user.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { MDLupdateDirective } from './mdlupdate.directive';
import { DmcaComponent } from './dmca/dmca.component';
import { CanActivateViaAuthGuardService } from './can-activate-via-auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    SongdisplayComponent,
    ChordEditorComponent,
    PrivacyPolicyComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MDLupdateDirective,
    DmcaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    ChordEditorService,
    UserService,
    CanActivateViaAuthGuardService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
