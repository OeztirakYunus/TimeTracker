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
import { HourListForEmployeeComponent } from './pages/hour-list-for-employee/hour-list-for-employee.component';
import { NgxMaterialTimepicker24HoursFaceComponent } from 'ngx-material-timepicker/src/app/material-timepicker/components/timepicker-24-hours-face/ngx-material-timepicker-24-hours-face.component';
import { NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditEmployeeComponent } from './pages/employees/edit-employee/edit-employee.component';
import { AddEmployeeComponent } from './pages/employees/add-employee/add-employee.component';
import { VacationRequestComponent } from './pages/vacation-request/vacation-request.component';
import { VacationsComponent } from './pages/vacations/vacations.component';


@NgModule({
  declarations: [
    AppComponent,
    StampTimeComponent,
    NavbarComponent,
    HourListComponent,
    EmployeesComponent,
    LoginComponent,
    RegisterComponent,
    MessageDialogComponent,
    HourListForEmployeeComponent,
    EditEmployeeComponent,
    AddEmployeeComponent,
    VacationRequestComponent,
    VacationsComponent
    
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
    NgxMaterialTimepickerModule
  ],
  providers: [HttpService, JwtTokenService, AuthService, MessageDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
