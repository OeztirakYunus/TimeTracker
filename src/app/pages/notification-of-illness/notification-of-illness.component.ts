import { Component, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { NotificationOfIllness } from 'src/app/model/notification-of-illness';
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
  selector: 'app-notification-of-illness',
  templateUrl: './notification-of-illness.component.html',
  styleUrls: ['./notification-of-illness.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NotificationOfIllnessComponent implements OnInit {
  @ViewChild('noiTableSort') noiTableSort: MatSort;
  @ViewChild('noiArchiveTableSort') noiArchiveTableSort: MatSort;
  displayedColumns: string[] = ['startDate', 'endDate', 'isConfirmed'];
  dataSource = new MatTableDataSource([] as NotificationOfIllness[]);
  dataSourceArchive = new MatTableDataSource([] as NotificationOfIllness[]);

  constructor(private http : HttpService) {}

  async ngOnInit() {
    var nois = await this.http.getNotificationOfIllnesses();
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    this.dataSource = new MatTableDataSource(nois); //.filter(i => !(i.startDate < currentDate && i.endDate > currentDate)));
    // Archive funktioniert noch nicht!
    this.dataSourceArchive = new MatTableDataSource(nois.filter(i => (i.startDate < currentDate && i.endDate > currentDate)));

    this.dataSourceArchive.sort = this.noiArchiveTableSort;
    this.dataSource.sort = this.noiTableSort;
  }
}
