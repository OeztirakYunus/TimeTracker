import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Stamp } from 'src/app/model/stamp';
import { WorkDay } from 'src/app/model/work-day';
import { HttpService } from 'src/app/services/http/http.service';

const daysInGerman = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

@Component({
  selector: 'app-stamp-time',
  templateUrl: './stamp-time.component.html',
  styleUrls: ['./stamp-time.component.css']
})
  
export class StampTimeComponent implements OnInit {
  displayedColumns: string[] = ['typeOfStamp', 'time'];
  dataSource : Stamp[] = [];
  dateNow = this.formatDate(new Date());
  workDay : WorkDay = new WorkDay();
  stampButtonText = "Dienstbeginn";
  breakButtonText = "Pause";
  public vacationDay = false;

  constructor(private http : HttpService){
  }
  
  async ngOnInit() {
    this.getWorkDay();
  }

  public  formatDate(date : Date) : string {
    var day = date.getDay();
    var dayDate = date.getDate().toString();
    var month = (date.getMonth() + 1).toString();
    var year = date.getFullYear();
    
    if (month.length < 2) 
        month = '0' + month;
    if (dayDate.length < 2) 
        dayDate = '0' + dayDate;

    return daysInGerman[day] + ", " + dayDate + "." + month + "." + year;
  }

  public getTime(date : Date){
    return date.toLocaleTimeString();
  }

  public async takeABreak() {
    await this.http.takeABreak();
    await this.getWorkDay();
  }

  public async stamp(){
    await this.http.stamp();
    await this.getWorkDay();
  }

  private async getWorkDay() {
    this.workDay = await this.http.getWorkDay();
    this.dataSource = this.workDay.stamps;
    if(this.dataSource.some(i => i.typeOfStamp === "Dienstbeginn")){
      this.stampButtonText = "Dienstende";
    }
    this.dataSource = this.dataSource.sort((a, b) => a.time.getTime() - b.time.getTime());

    for (let index = this.dataSource.length - 1; index >= 0; index--) {
      const element = this.dataSource[index];
      if(element.typeOfStamp == "Pause"){
       this.breakButtonText = "Pause beenden"; 
       return;
      }
      else if(element.typeOfStamp == "PauseEnde"){
        this.breakButtonText = "Pause"; 
        return;
      }
    }
    this.vacationDay = this.workDay.vacationDay;
    if(this.vacationDay){
      this.dataSource = [];
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
}
