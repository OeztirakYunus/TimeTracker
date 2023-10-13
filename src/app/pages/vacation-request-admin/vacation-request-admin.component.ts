import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Vacation } from 'src/app/model/vacation';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-vacation-request-admin',
  templateUrl: './vacation-request-admin.component.html',
  styleUrls: ['./vacation-request-admin.component.css']
})
export class VacationRequestAdminComponent implements OnInit {
  displayedColumns: string[] = ['nameOfEmployee','dateOfRequest', 'startDate', 'endDate', 'actions'];
  displayedColumnsConfirmed: string[] = ['nameOfEmployee','dateOfRequest', 'startDate', 'endDate', 'status', 'actions'];
  dataSourceConfirmed = new MatTableDataSource([] as Vacation[]);
  dataSourceRejected = new MatTableDataSource([] as Vacation[]);
  dataSourceInProgress = new MatTableDataSource([] as Vacation[]);

  constructor(private http : HttpService) {    
  }
  async ngOnInit() {
    await this.getAllVacations();
  }

  async getAllVacations(){
    var vacations = await this.http.getAllVacations();

    this.dataSourceInProgress = new MatTableDataSource(vacations.filter(i => i.status === "InBearbeitung"));
    this.dataSourceConfirmed = new MatTableDataSource(vacations.filter(i => i.status === "Bestaetigt"));
    this.dataSourceRejected = new MatTableDataSource(vacations.filter(i => i.status === "Abgelehnt"));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceConfirmed.filter = filterValue.trim().toLowerCase();
    this.dataSourceInProgress.filter = filterValue.trim().toLowerCase();
    this.dataSourceRejected.filter = filterValue.trim().toLowerCase();

  }

  async confirmClicked(id : string){
    await this.http.confirmVacation(id);
    await this.getAllVacations();
  }

  async rejectClicked(id : string){
    await this.http.rejectVacation(id);
    await this.getAllVacations();
  }

  getStatusText(vacation : Vacation) : string{
    var date = new Date();
    var vacationStartDate = vacation.startDate;
    var vacationEndDate = vacation.endDate;
    date.setHours(0,0,0,0);
    vacationStartDate.setHours(0,0,0,0);
    vacationEndDate.setHours(0,0,0,0);

    if(vacationStartDate <= date && vacationEndDate >= date){
      return "Urlaub begonnen";
    }
    else if(vacationStartDate < date && vacationEndDate < date){
      return "Urlaub abgeschlossen"
    }
    else{
      return "Urlaub offen"
    }
  }

  async deleteVacation(vacation : Vacation){
    await this.http.deleteVacation(vacation);
    await this.getAllVacations();
  }
}
