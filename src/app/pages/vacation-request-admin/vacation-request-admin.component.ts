import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Vacation } from 'src/app/model/vacation';
import { HttpVacationService } from 'src/app/services/http/vacation/http-vacation.service';

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
  dataSourceArchive = new MatTableDataSource([] as Vacation[]);

  constructor(private http : HttpVacationService) {    
  }
  async ngOnInit() {
    await this.getAllVacations();

    this.dataSourceInProgress.filterPredicate = (data, filter: string)  => this.filterPredicat(data, filter);
    this.dataSourceArchive.filterPredicate = (data, filter: string)  => this.filterPredicat(data, filter);
    this.dataSourceConfirmed.filterPredicate = (data, filter: string)  => this.filterPredicat(data, filter);
    this.dataSourceRejected.filterPredicate = (data, filter: string)  => this.filterPredicat(data, filter);
  }

  private filterPredicat(data : Vacation, filter : string){
    return data.employee.lastName.toLocaleLowerCase().includes(filter) ||
      data.employee.firstName.toLocaleLowerCase().includes(filter) ||
      data.dateOfRequest.toDateString().toLocaleLowerCase().includes(filter) ||
      data.startDate.toDateString().toLocaleLowerCase().includes(filter) ||
      data.endDate.toDateString().toLocaleLowerCase().includes(filter)
  }

  async getAllVacations(){
    var vacations = await this.http.getAllVacations();
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    this.dataSourceInProgress = new MatTableDataSource(vacations.filter(i => i.status === "InBearbeitung"));
    this.dataSourceConfirmed = new MatTableDataSource(vacations.filter(i => i.status === "Bestaetigt").filter(i => !(i.startDate < currentDate && i.endDate < currentDate)));
    this.dataSourceRejected = new MatTableDataSource(vacations.filter(i => i.status === "Abgelehnt").filter(i => !(i.startDate < currentDate && i.endDate < currentDate)));
    this.dataSourceArchive = new MatTableDataSource(vacations.filter(i => (i.startDate < currentDate && i.endDate < currentDate) && i.status !== "InBearbeitung"));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceConfirmed.filter = filterValue.trim().toLowerCase();
    this.dataSourceInProgress.filter = filterValue.trim().toLowerCase();
    this.dataSourceRejected.filter = filterValue.trim().toLowerCase();
    this.dataSourceArchive.filter = filterValue.trim().toLowerCase();
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
