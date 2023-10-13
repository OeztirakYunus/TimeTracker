import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vacation } from 'src/app/model/vacation';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css']
})
export class VacationsComponent implements OnInit {
  @ViewChild('confirmedTableSort') confirmedTableSort: MatSort;
  @ViewChild('rejectedTableSort') rejectedTableSort: MatSort;
  @ViewChild('inProgressTableSort') inProgressTableSort: MatSort;

  displayedColumns: string[] = ['dateOfRequest', 'startDate', 'endDate'];
  displayedColumnsConfirmed: string[] = ['dateOfRequest', 'startDate', 'endDate', 'status'];
  dataSourceConfirmed = new MatTableDataSource([] as Vacation[]);
  dataSourceRejected = new MatTableDataSource([] as Vacation[]);
  dataSourceInProgress = new MatTableDataSource([] as Vacation[]);

  constructor(private http : HttpService) {    
  }
  async ngOnInit() {
    var vacations = await this.http.getVacations();

    this.dataSourceInProgress = new MatTableDataSource(vacations.filter(i => i.status === "InBearbeitung"));
    this.dataSourceConfirmed = new MatTableDataSource(vacations.filter(i => i.status === "Bestaetigt"));
    this.dataSourceRejected = new MatTableDataSource(vacations.filter(i => i.status === "Abgelehnt"));

    this.dataSourceConfirmed.sort = this.confirmedTableSort;
    this.dataSourceInProgress.sort = this.inProgressTableSort;
    this.dataSourceRejected.sort = this.rejectedTableSort;
  }

  getStatusText(vacation : Vacation) : string{
    var date = new Date();
    if(vacation.startDate <= date && vacation.endDate >= date){
      return "Urlaub begonnen";
    }
    else if(vacation.startDate < date && vacation.endDate < date){
      return "Urlaub abgeschlossen"
    }
    else{
      return "Urlaub offen"
    }
  }
}
