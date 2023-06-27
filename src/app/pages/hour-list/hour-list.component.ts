import { Component } from '@angular/core';
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

  displayedColumnsMonth: string[] = ['day', 'workedHours'];
  dataSourceMonth : WorkDay[] = [];

  public pickedDate : Date = new Date();
  workMonth = new WorkMonth();

  constructor(private http : HttpService){
    this.getWorkMonth();
  }

  async getWorkMonth(){
    this.workMonth = await this.http.getWorkMonth(this.pickedDate );
    this.dataSourceMonth = this.workMonth.workDays;
    var day = this.workMonth.workDays.find(i => i.date.getDate() === this.pickedDate.getDate())?.stamps;
    if(day != undefined){
      this.dataSourceDay = day;
    }
    else{
      this.dataSourceDay = [];
    }
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
