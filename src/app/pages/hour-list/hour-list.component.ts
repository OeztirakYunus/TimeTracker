import { Component } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { Stamp } from 'src/app/model/stamp';
import { WorkDay } from 'src/app/model/work-day';
import { WorkMonth } from 'src/app/model/work-month';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpWorkmonthService } from 'src/app/services/http/workmonth/http-workmonth.service';


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
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class HourListComponent {
  displayedColumnsDay: string[] = ['typeOfStamp', 'time'];
  dataSourceDay : Stamp[] = [];
  days : WorkDay[] = [];
  lengthOfPaginator : number = 0;

  displayedColumnsMonth: string[] = ['day', 'startTime', 'endTime', 'breakHours', 'workedHours'];
  dataSourceMonth : WorkDay[] = [];

  public pickedDate : moment.Moment = moment();
  workMonth = new WorkMonth();
  public vacationDay = false;
  public illDay = false;

  constructor(private http : HttpWorkmonthService, private auth : AuthService){
    this.getWorkMonth();
  }

  async getAsPdf(){
    var loggedInUser = await this.auth.getLoggedInUser();
    await this.http.getAsPdf(this.workMonth, loggedInUser, this.pickedDate.toDate());
  }

  async getWorkMonth(){
    this.workMonth = await this.http.getWorkMonth(this.pickedDate.toDate());
    var workDays = [] as WorkDay[];
    var day = undefined;
    if(this.workMonth.workDays.length > 0){
      this.workMonth.workDays.forEach(element => {
        element.forEach(element2 => {
          workDays.push(element2);
        });
      });

      this.days = this.workMonth.workDays[this.pickedDate.toDate().getDate() - 1];
      this.lengthOfPaginator = this.days.length; 
      day = this.days[0]?.stamps;
      this.vacationDay = this.days[0].vacationDay;
      this.illDay = this.days[0].illDay;
    }
    this.dataSourceMonth = workDays;

    if(day != undefined && this.vacationDay == false){
      this.dataSourceDay = day;
    }
    else{
      this.dataSourceDay = [];
    }
  }

  handlePageEvent(event : PageEvent){
    this.dataSourceDay = this.days[event.pageIndex]?.stamps;
  }

  public getBackgroundColor(typeOfStamp : string){ //v = vacation
    switch (typeOfStamp) {
      case "Dienstbeginn":
        return "green";
      case "Dienstende":
        return "red";
      case "Pause":
        return "yellow";
      case "PauseEnde":
        return "green";
      default:
        return "white";
    }   
  }

  public getBackgoundColorForMonthList(element : WorkDay){
    if(element.illDay){
      return "red";
    }
    else if(element.vacationDay){
      return "yellow";
    }
    return "white";
  }

  public getColText(element : WorkDay, text : string){
    if(element.illDay){
      return "K";
    }
    else if(element.vacationDay){
      return "U";
    }
    return text;
  }

  public getTime(date : Date){
    var time = "";
    time = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours().toLocaleString();
    time += ":";
    time += date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes().toLocaleString();
    return time;
  }

  public roundNumberAsString(nmbr : number){
    return this.customRound(nmbr, 1).toString();
  }

  private customRound(value: number, decimalPlaces: number): number {
    if (value === 0) return 0;

    const valueStr = value.toString();

    // Falls der Wert größer als 1 oder kleiner als -1 ist, normal runden
    if (Math.abs(value) >= 1) {
        return parseFloat(value.toFixed(decimalPlaces));
    }

    // Sonst: Finde die erste signifikante Stelle nach der 0
    const match = valueStr.match(/0\.0*(\d)/);
    if (match) {
        const significantDigits = match[0].length - 2; // Anzahl der führenden Nullen nach "0."
        return parseFloat(value.toFixed(significantDigits + decimalPlaces));
    }

    return parseFloat(value.toFixed())
  }
}
