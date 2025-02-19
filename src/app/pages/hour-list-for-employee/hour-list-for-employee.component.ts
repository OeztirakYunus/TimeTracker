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
import { AddStampComponent } from '../add-stamp/add-stamp.component';
import { DialogType, MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HttpWorkmonthService } from 'src/app/services/http/workmonth/http-workmonth.service';
import { HttpEmployeeService } from 'src/app/services/http/employee/http-employee.service';
import { HttpWorkdayService } from 'src/app/services/http/workday/http-workday.service';
import { HttpStampService } from 'src/app/services/http/stamp/http-stamp.service';

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
  constructor(private activatedroute:ActivatedRoute, private httpWorkmonth : HttpWorkmonthService, private httpEmployee : HttpEmployeeService, private httpWorkday : HttpWorkdayService, private httpStamp : HttpStampService, public router : Router, private ds: DialogService)
  {
    this.employeeId = activatedroute.snapshot.params["id"];
    this.getWorkMonth();
  }
  
  async ngOnInit(){
    this.employee = await this.httpEmployee.getEmployeeById(this.employeeId);
  }

  displayedColumnsDay: string[] = ['typeOfStamp', 'time'];
  dataSourceDay : Stamp[] = [];
  days : WorkDay[] = [];
  lengthOfPaginator : number = 0;

  displayedColumnsMonth: string[] = ['day', 'startTime', 'endTime', 'breakHours', 'workedHours'];
  dataSourceMonth : WorkDay[] = [];

  public pickedDate : moment.Moment = moment();
  workMonth = new WorkMonth();
  public stampButtonText = 'Dienstbeginn hinzufügen';
  public breakButtonText = 'Pause hinzufügen';
  public vacationDay = false;
  public illDay = false;


  async getAsPdf(){
    await this.httpWorkmonth.getAsPdf(this.workMonth, this.employee, this.pickedDate.toDate());
  }

  async getWorkMonth(){
    this.workMonth = await this.httpWorkmonth.getWorkMonthForEmployee(this.pickedDate.toDate(), this.employeeId);
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

    this.setButtonText(); 
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
    var time = "";
    time = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours().toLocaleString();
    time += ":";
    time += date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes().toLocaleString();
    return time;
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

  async saveStamps(){
    var confirmed = await this.ds.showConfirmMessage("Möchten Sie wirklich speichern?");
    if(confirmed){
      if(this.dataSourceDay.length > 0){
        await this.httpStamp.updateStamps(this.dataSourceDay);
        await this.getWorkMonth();
        this.ds.showNotificationMessage("Daten wurden erfolgreich gespeichert!");
      }
      else{
        this.ds.showErrorMessage("Keine Daten zum Speichern vorhanden!");
      }
    }
  }

  async deleteWorkDay(){
    var confirmed = await this.ds.showConfirmMessage("Möchten Sie wirklich löschen?");
    if(confirmed){
      if(this.dataSourceDay.length > 0){
        var stamp : Stamp = this.dataSourceDay[0];
        await this.httpWorkday.deleteWorkDay(stamp.workDayId);
        await this.getWorkMonth();
        this.ds.showNotificationMessage("Daten wurden erfolgreich gelöscht!");
      } else{
        this.ds.showErrorMessage("Keine Daten zum Löschen vorhanden!");
      }
    }
  }

  public setButtonText(){
    
    if(this.dataSourceDay.some(i => i.typeOfStamp === "Dienstbeginn") && this.dataSourceDay.some(i => i.typeOfStamp === "Dienstende")){
      this.stampButtonText = "Dienstbeginn hinzufügen";
    }
    else if(this.dataSourceDay.some(i => i.typeOfStamp === "Dienstbeginn")){
      this.stampButtonText = "Dienstende hinzufügen";
    }
    this.dataSourceDay = this.dataSourceDay.sort((a, b) => a.time.getTime() - b.time.getTime());

    for (let index = this.dataSourceDay.length - 1; index >= 0; index--) {
      const element = this.dataSourceDay[index];
      if(element.typeOfStamp == "Pause"){
       this.breakButtonText = "Pausenende hinzufügen"; 
       return;
      }
      else if(element.typeOfStamp == "PauseEnde"){
        this.breakButtonText = "Pause hinzufügen"; 
        return;
      }
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

  public async takeABreakManually() {
    var confirmed = await this.ds.showConfirmMessage("Möchten Sie wirklich stempeln?");
    if(confirmed){
      var day = this.pickedDate.toDate().getDate();
      var month = this.pickedDate.toDate().getMonth();
      var year = this.pickedDate.toDate().getFullYear();
      var date = new Date();
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
      await this.httpStamp.takeABreakManually(this.employeeId, date);
      await this.getWorkMonth();
    }
  }

  public async stampManually(){
    var confirmed = await this.ds.showConfirmMessage("Möchten Sie wirklich stempeln?");
    if(confirmed){
      var day = this.pickedDate.toDate().getDate();
      var month = this.pickedDate.toDate().getMonth();
      var year = this.pickedDate.toDate().getFullYear();
      var date = new Date();
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
      await this.httpStamp.stampManually(this.employeeId, date);
      await this.getWorkMonth();
    }
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