import { Component, OnInit } from '@angular/core';
import { Vacation } from 'src/app/model/vacation';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-vacation-request-admin',
  templateUrl: './vacation-request-admin.component.html',
  styleUrls: ['./vacation-request-admin.component.css']
})
export class VacationRequestAdminComponent implements OnInit {
  displayedColumns: string[] = ['nameOfEmployee','dateOfRequest', 'startDate', 'endDate', 'status'];
  displayedColumnsInProgress: string[] = ['nameOfEmployee','dateOfRequest', 'startDate', 'endDate', 'status', 'actions'];
  dataSourceConfirmed : Vacation[] = [];
  dataSourceRejected : Vacation[] = [];
  dataSourceInProgress : Vacation[] = [];

  constructor(private http : HttpService) {    
  }
  async ngOnInit() {
    var vacations = await this.http.getAllVacations();

    this.dataSourceInProgress = vacations.filter(i => i.status === "InBearbeitung");
    this.dataSourceConfirmed = vacations.filter(i => i.status === "Bestaetigt");
    this.dataSourceRejected = vacations.filter(i => i.status === "Abgelehnt");
  }

  async confirmClicked(id : string){
    await this.http.confirmVacation(id);
    await this.ngOnInit();
  }

  async rejectClicked(id : string){
    await this.http.rejectVacation(id);
    await this.ngOnInit();
  }
}
