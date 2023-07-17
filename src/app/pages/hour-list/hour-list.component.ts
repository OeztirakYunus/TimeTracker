import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Stamp } from 'src/app/model/stamp';
import { WorkDay } from 'src/app/model/work-day';
import { WorkMonth } from 'src/app/model/work-month';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.css'],
})

export class HourListComponent {
  displayedColumnsDay: string[] = ['typeOfStamp', 'time'];
  dataSourceDay : Stamp[] = [];
  days : WorkDay[] = [];
  lengthOfPaginator : number = 0;

  displayedColumnsMonth: string[] = ['day', 'startTime', 'endTime', 'breakHours', 'workedHours'];
  dataSourceMonth : WorkDay[] = [];

  public pickedDate : Date = new Date();
  workMonth = new WorkMonth();

  constructor(private http : HttpService){
    this.getWorkMonth();
  }

  async getWorkMonth(){
    this.workMonth = await this.http.getWorkMonth(this.pickedDate);
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
