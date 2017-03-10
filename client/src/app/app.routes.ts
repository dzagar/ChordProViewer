import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAuthGuardService } from './can-activate-via-auth-guard.service';
import { SongdisplayComponent } from './songdisplay/songdisplay.component';
import { ChordEditorComponent } from './chord-editor/chord-editor.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DmcaComponent } from './dmca/dmca.component';

export const routes: Routes = [
  { path: 'chord-editor', component: ChordEditorComponent, canActivate: [CanActivateViaAuthGuardService] },
  { path: 'songdisplay', component: SongdisplayComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dmca', component: DmcaComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);