// app-routing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterLink,
  RouterModule,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import {HttpClient } from '@angular/core';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { GuestviewComponent } from './components/guestview/guestview.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';

// material angular
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GuardService } from './services/guard.service';
import { AddNewComponent } from './components/add-new/add-new.component';
import { AddDataComponent } from './components/add-data/add-data.component';


export const routes: Routes = [
  { path: 'guest', component: GuestviewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [GuardService],
  },
  { path: 'addnew', component: AddNewComponent, canActivate: [GuardService] },
  { path: 'adddata', component: AddDataComponent, canActivate: [GuardService] }, //add-data-component
  { path: 'register', component: RegisterComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' }, //
  { path: '', redirectTo: '/guest', pathMatch: 'full' },
  // {path: <base-path>, component: <component>, outlet: <target_outlet_name>}
  // { path: 'header', component: HeaderComponent, outlet:top },
];

@NgModule({
  declarations: [
    GuestviewComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    // Add other components here
    // HeaderComponent,
    AboutComponent,
    // FooterComponent,
    AddNewComponent,
    AddDataComponent,
    LeftMenuComponent,
  ],

  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    RouterLink,
    RouterOutlet,
    HttpClientModule,
    BrowserAnimationsModule,
    // MatSidenavModule,
    // MatIconModule,
    // MatListModule,
    // MatToolbarModule,
    // MatButtonModule,
    // MatMenuModule,

    // NoopAnimationsModule
  ],

  providers: [
    // Xóa AuthService khỏi mảng providers
    AuthService,
    GuardService,
    provideAnimationsAsync(),
    provideAnimations(),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
