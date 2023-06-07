import { Component } from '@angular/core';

export interface TimeTrackerTEST {
  type: string;
  time: string;
  hours: string;
  color: string
}

const ELEMENT_DATA_DAY: TimeTrackerTEST[] = [
  {type: "Dienstbeginn", time: "07:00", hours: "0", color: "green"},
  {type: "Pause", time: "12:00", hours: "5", color: "yellow"},
  {type: "Pause beendet", time: "12:00", hours: "5", color: "green"},
  {type: "Dienstende", time: "15:30", hours: "8", color: "red"}
];

export interface MonthTEST {
  day: string;
  hours: string;
  breaks: string;
}

const ELEMENT_DATA_MONTH: MonthTEST[] = [
  {day: "1", breaks: "0.5", hours: "8"},
  {day: "2", breaks: "0.5", hours: "8"},
  {day: "3", breaks: "0.5", hours: "8"},
  {day: "4", breaks: "0.5", hours: "8"},
  {day: "5", breaks: "0.5", hours: "8"},
  {day: "6", breaks: "0.5", hours: "8"},
  {day: "7", breaks: "0.5", hours: "8"},
  {day: "8", breaks: "0.5", hours: "8"},
  {day: "9", breaks: "0.5", hours: "8"},
  {day: "10", breaks: "0.5", hours: "8"},
  {day: "11", breaks: "0.5", hours: "8"},
  {day: "12", breaks: "0.5", hours: "8"},
  {day: "13", breaks: "0.5", hours: "8"},
  {day: "14", breaks: "0.5", hours: "8"},
  {day: "15", breaks: "0.5", hours: "8"},
  {day: "16", breaks: "0.5", hours: "8"},
  {day: "17", breaks: "0.5", hours: "8"},
  {day: "18", breaks: "0.5", hours: "8"},
  {day: "19", breaks: "0.5", hours: "8"},
  {day: "20", breaks: "0.5", hours: "8"},
  {day: "21", breaks: "0.5", hours: "8"},
  {day: "22", breaks: "0.5", hours: "8"},
  {day: "23", breaks: "0.5", hours: "8"},
  {day: "24", breaks: "0.5", hours: "8"},
  {day: "25", breaks: "0.5", hours: "8"},
  {day: "26", breaks: "0.5", hours: "8"},
  {day: "27", breaks: "0.5", hours: "8"},
  {day: "28", breaks: "0.5", hours: "8"},
  {day: "29", breaks: "0.5", hours: "8"},
  {day: "30", breaks: "0.5", hours: "8"}
];

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.css'],
})

export class HourListComponent {
  displayedColumnsDay: string[] = ['type', 'time', 'hours'];
  dataSourceDay = ELEMENT_DATA_DAY;

  displayedColumnsMonth: string[] = ['day', 'breaks', 'hours'];
  dataSourceMonth = ELEMENT_DATA_MONTH;
}
