import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { Stamp } from 'src/app/model/stamp';
import { WorkDay } from 'src/app/model/work-day';
import { WorkMonth } from 'src/app/model/work-month';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-hour-list-for-employee',
  templateUrl: './hour-list-for-employee.component.html',
  styleUrls: ['./hour-list-for-employee.component.css']
})
export class HourListForEmployeeComponent implements OnInit {

  private employeeId : string = "";
  public employee : Employee = new Employee();
  constructor(private activatedroute:ActivatedRoute, private http : HttpService)
  {
    this.employeeId = activatedroute.snapshot.params["id"];
    this.getWorkMonth();
  }
  
  async ngOnInit(){
    this.employee = await this.http.getEmployeeById(this.employeeId);
  }

  displayedColumnsDay: string[] = ['typeOfStamp', 'time'];
  dataSourceDay : Stamp[] = [];
  days : WorkDay[] = [];
  lengthOfPaginator : number = 0;

  displayedColumnsMonth: string[] = ['day', 'workedHours'];
  dataSourceMonth : WorkDay[] = [];

  public pickedDate : Date = new Date();
  workMonth = new WorkMonth();

  async getWorkMonth(){
    this.workMonth = await this.http.getWorkMonthForEmployee(this.pickedDate, this.employeeId);
    var workDays = [] as WorkDay[];
    this.workMonth.workDays.forEach(element => {
      element.forEach(element2 => {
        workDays.push(element2);
      });
    });
    this.dataSourceMonth = workDays;
    this.days = this.workMonth.workDays[this.pickedDate.getDate() - 1];
    this.lengthOfPaginator = this.days.length; 
    var day = this.days[0]?.stamps;
    if(day != undefined){
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
}
