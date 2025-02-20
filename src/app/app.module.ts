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
import { VacationRequestAdminComponent } from './pages/vacation-request-admin/vacation-request-admin.component';
import { NotificationOfIllnessComponent } from './pages/notification-of-illness/notification-of-illness.component';
import { NotificationOfIllnessRequestComponent } from './pages/notification-of-illness-request/notification-of-illness-request.component';
import { NotificationOfIllnessRequestAdminComponent } from './pages/notification-of-illness-request-admin/notification-of-illness-request-admin.component';
import { AddStampComponent } from './pages/add-stamp/add-stamp.component';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { DialogService } from './services/dialog/dialog.service';
import { HttpCompanyService } from './services/http/company/http-company.service';
import { HttpEmployeeService } from './services/http/employee/http-employee.service';
import { HttpNoiService } from './services/http/noi/http-noi.service';
import { HttpStampService } from './services/http/stamp/http-stamp.service';
import { HttpVacationService } from './services/http/vacation/http-vacation.service';
import { HttpWorkdayService } from './services/http/workday/http-workday.service';
import { HttpWorkmonthService } from './services/http/workmonth/http-workmonth.service';


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
    VacationsComponent,
    VacationRequestAdminComponent,
    NotificationOfIllnessComponent,
    NotificationOfIllnessRequestComponent,
    NotificationOfIllnessRequestAdminComponent,
    AddStampComponent    
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
  providers: [JwtTokenService, AuthService, DialogService, LocalStorageCache, HttpCompanyService, HttpEmployeeService, HttpNoiService, HttpStampService, HttpVacationService, HttpWorkdayService, HttpWorkmonthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
