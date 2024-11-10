import { Component, inject, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee';
import { Stamp } from 'src/app/model/stamp';
import { WorkDay } from 'src/app/model/work-day';
import { WorkMonth } from 'src/app/model/work-month';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpService } from 'src/app/services/http/http.service';
import { AddStampComponent } from '../add-stamp/add-stamp.component';

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
  selector: 'app-hour-list-for-employee',
  templateUrl: './hour-list-for-employee.component.html',
  styleUrls: ['./hour-list-for-employee.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class HourListForEmployeeComponent implements OnInit {

  private employeeId : string = "";
  public employee : Employee = new Employee();
  constructor(private activatedroute:ActivatedRoute, private http : HttpService, private auth : AuthService, public router : Router, public dialog: MatDialog)
  {
    this.employeeId = activatedroute.snapshot.params["id"];
    this.getWorkMonth();
  }
  
  async ngOnInit(){
    this.employee = await this.http.getEmployeeById(this.employeeId);
  }

  displayedColumnsDay: string[] = ['typeOfStamp', 'time', 'actions'];
  dataSourceDay : Stamp[] = [];
  days : WorkDay[] = [];
  lengthOfPaginator : number = 0;

  displayedColumnsMonth: string[] = ['day', 'startTime', 'endTime', 'breakHours', 'workedHours'];
  dataSourceMonth : WorkDay[] = [];

  public pickedDate : moment.Moment = moment();
  workMonth = new WorkMonth();
  public vacationDay = false;
  public illDay = false;


  async getAsPdf(){
    await this.http.getAsPdf(this.workMonth, this.employeeId, this.pickedDate.toDate());
  }

  async getWorkMonth(){
    this.workMonth = await this.http.getWorkMonthForEmployee(this.pickedDate.toDate(), this.employeeId);
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

  public getBackgroundColor(typeOfStamp : string){
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

  public getTime(date : Date){
    return date.toLocaleTimeString();
  }

  async deleteWorkDay(stamp : Stamp){
    await this.http.deleteWorkDay(stamp.workDayId)
    await this.getWorkMonth();
  }

  getValueForTimePicker(element : Stamp){
    var timeWithSeconds = this.getTime(element.time);
    var timeSplitted = timeWithSeconds.split(":");
    var time = timeSplitted[0] + ":" + timeSplitted[1];
    return time;
  }

  getDateForElement(element : Stamp)
  {
    return element.time;
  }

  dateChanged(event : any, element : Stamp){
    var hours = element.time.getHours();
    var minutes = element.time.getMinutes();
    var seconds = element.time.getSeconds();

    var dateMoment = event["value"] as moment.Moment;
    element.time = dateMoment.toDate();
    element.time.setHours(hours);
    element.time.setMinutes(minutes);
    element.time.setSeconds(seconds);
  }

  timeChanged(event : string, element : Stamp){
    var time = event.split(":");
    element.time.setHours(+time[0])
    element.time.setMinutes(+time[1])
  }

  async saveChanges(element : Stamp){
    await this.http.updateStamp(element);
    await this.getWorkMonth();
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

  public async takeABreakManually() {
    var day = this.pickedDate.toDate().getDate();
    var month = this.pickedDate.toDate().getMonth();
    var year = this.pickedDate.toDate().getFullYear();
    var date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);
    await this.http.takeABreakManually(this.employeeId, date);
    await this.getWorkMonth();
  }

  public async stampManually(){
    var day = this.pickedDate.toDate().getDate();
    var month = this.pickedDate.toDate().getMonth();
    var year = this.pickedDate.toDate().getFullYear();
    var date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);
    await this.http.stampManually(this.employeeId, date);
    await this.getWorkMonth();
  }
}