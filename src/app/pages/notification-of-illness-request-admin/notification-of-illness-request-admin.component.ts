import { Component, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationOfIllness } from 'src/app/model/notification-of-illness';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { HttpNoiService } from 'src/app/services/http/noi/http-noi.service';

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
  displayedColumns: string[] = ['nameOfEmployee', 'startDate', 'endDate', 'isConfirmed', 'actions'];
  dataSource = new MatTableDataSource([] as NotificationOfIllness[]);

  constructor(private http : HttpNoiService, private ds : DialogService) {}

  async ngOnInit() {
    await this.getAll();
  }

  async getAll(){
    var nois = await this.http.getAllNois();
    this.dataSource = new MatTableDataSource(nois);
    
    this.dataSource.filterPredicate = (data, filter: string)  => this.filterPredicat(data, filter);
    this.dataSource.sort = this.noiTableSort;
  }

  private filterPredicat(data : NotificationOfIllness, filter : string){
    return data.employee.lastName.toLocaleLowerCase().includes(filter) ||
      data.employee.firstName.toLocaleLowerCase().includes(filter) ||
      data.startDate.toDateString().toLocaleLowerCase().includes(filter) ||
      data.endDate.toDateString().toLocaleLowerCase().includes(filter)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async onChange(noi : NotificationOfIllness){
    if(noi.isConfirmed){
      await this.http.confirmNoi(noi.id);
    }
    else{
      await this.http.rejectNoi(noi.id);
    }
  }

  async deleteNoi(noi : NotificationOfIllness){
    await this.http.deleteNoi(noi);
    await this.getAll();
  }

  async downloadFile(noi : NotificationOfIllness){
    if(noi.confirmationFile != null){
      const byteCharacters = atob(noi.confirmationFile.toString());
      var fileType = 'image/png';
      var fileEnd = ".png";
      if(byteCharacters.toLowerCase().includes("pdf")){
        fileType = 'application/pdf';
        fileEnd = ".pdf";
      }else if(byteCharacters.toLowerCase().includes("png")){
        fileType = 'image/png';
        fileEnd = ".png";
      }else if(byteCharacters.toLowerCase().includes("jpeg")){
        fileType = 'image/jpeg';
        fileEnd = ".jpeg";
      }
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Blob für PNG erzeugen
      const blob = new Blob([byteArray], { type: fileType });

      // URL erstellen und zum Herunterladen nutzen
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Krankenstandsbestätigung_'+ noi.employee.lastName + "_" + noi.employee.firstName + fileEnd;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    else{
      this.ds.showErrorMessage("Keine Ärtzliche Bestätigung gefunden");
    }
  }
}
