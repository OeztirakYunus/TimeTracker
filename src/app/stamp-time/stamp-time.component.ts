import { Component } from '@angular/core';

const daysInGerman = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

export interface TimeTrackerTEST {
  type: string;
  time: string;
  hours: string;
  color: string
}

const ELEMENT_DATA: TimeTrackerTEST[] = [
  {type: "Dienstbeginn", time: "07:00", hours: "0", color: "green"},
  {type: "Pause", time: "12:00", hours: "5", color: "yellow"},
  {type: "Pause beendet", time: "12:00", hours: "5", color: "green"},
  {type: "Dienstende", time: "15:30", hours: "8", color: "red"}
];

@Component({
  selector: 'app-stamp-time',
  templateUrl: './stamp-time.component.html',
  styleUrls: ['./stamp-time.component.css']
})
  
export class StampTimeComponent {
  bcolor = "red"
  displayedColumns: string[] = ['type', 'time', 'hours'];
  dataSource = ELEMENT_DATA;
  dateNow = this.formatDate(new Date());

  item = "red";
  private  formatDate(date : Date) : string {
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
}
