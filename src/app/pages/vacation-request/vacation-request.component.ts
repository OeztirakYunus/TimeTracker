import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee';
import { Vacation } from 'src/app/model/vacation';
import { VacationAdd } from 'src/app/model/vacation-add';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpService } from 'src/app/services/http/http.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-vacation-request',
  templateUrl: './vacation-request.component.html',
  styleUrls: ['./vacation-request.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class VacationRequestComponent implements OnInit{
  public startDate : moment.Moment = moment();
  public endDate : moment.Moment = moment();
  public nameOfEmployee = "";

  constructor(private http : HttpService, private auth : AuthService) {
  }
  async ngOnInit() {
    var user = await this.auth.getLoggedInUser();
    this.nameOfEmployee = user.lastName + " " + user.firstName;
  }

  public getDateAsString(date :  moment.Moment) : string{
    if(date == null){
      return "";
    }

    return date.toDate().toLocaleDateString();
  }

  public getVacationDaysAsString() : string{
    if(this.endDate == null || this.startDate == null){
      return "";
    }

    var diff = Math.abs(this.endDate.toDate().getTime() - this.startDate.toDate().getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    diffDays = diffDays < 1 ? 1 : diffDays;
    return diffDays.toString();
  }

  async addClicked(){
    let vacation = new VacationAdd();
    var startDate = this.startDate.toDate();
    var endDate = this.endDate.toDate();
    var vsDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
    var veDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);

    vacation.startDate = vsDate;
    vacation.endDate = veDate;
    await this.http.addVacation(vacation);
  }
}
