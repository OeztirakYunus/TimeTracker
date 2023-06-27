import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StampTimeComponent } from './pages/stamp-time/stamp-time.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material-module';
import { RouterModule } from '@angular/router';
import { HourListComponent } from './pages/hour-list/hour-list.component';
import { EmployeesComponent } from './pages/employees/employees.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http/http.service';
import { JwtTokenService } from './services/jwt/jwt-token.service';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    StampTimeComponent,
    NavbarComponent,
    HourListComponent,
    EmployeesComponent,
    LoginComponent,
    RegisterComponent,
    MessageDialogComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    

  ],
  providers: [HttpService, JwtTokenService, AuthService, MessageDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
