import { Component, OnInit } from '@angular/core';
import { Vacation } from 'src/app/model/vacation';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css']
})
export class VacationsComponent implements OnInit {
  displayedColumns: string[] = ['dateOfRequest', 'startDate', 'endDate', 'status'];
  dataSourceConfirmed : Vacation[] = [];
  dataSourceRejected : Vacation[] = [];
  dataSourceInProgress : Vacation[] = [];

  constructor(private http : HttpService) {    
  }
  async ngOnInit() {
    var vacations = await this.http.getVacations();

    this.dataSourceInProgress = vacations.filter(i => i.status === "InBearbeitung");
    this.dataSourceConfirmed = vacations.filter(i => i.status === "Bestaetigt");
    this.dataSourceRejected = vacations.filter(i => i.status === "Abgelehnt");
  }
}
