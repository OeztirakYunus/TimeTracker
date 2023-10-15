import { Component, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-notification-of-illness-request-admin',
  templateUrl: './notification-of-illness-request-admin.component.html',
  styleUrls: ['./notification-of-illness-request-admin.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NotificationOfIllnessRequestAdminComponent {
  @ViewChild('noiTableSort') noiTableSort: MatSort;
  displayedColumns: string[] = ['nameOfEmployee', 'startDate', 'endDate', 'isConfirmed'];
  dataSource = new MatTableDataSource([] as NotificationOfIllness[]);

  constructor(private http : HttpService) {}

  async ngOnInit() {
    var nois = await this.http.getAllNois();
    this.dataSource = new MatTableDataSource(nois);
    this.dataSource.sort = this.noiTableSort;
  }

  onChange(noi : NotificationOfIllness){
    if(noi.isConfirmed){
      this.http.confirmNoi(noi.id);
    }
    else{
      this.http.rejectNoi(noi.id);
    }
  }
}
