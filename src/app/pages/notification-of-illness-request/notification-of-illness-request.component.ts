import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogType, MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { NotificationOfIllness } from 'src/app/model/notification-of-illness';
import { NotificationOfIllnessAdd } from 'src/app/model/notification-of-illness-add';
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
  selector: 'app-notification-of-illness-request',
  templateUrl: './notification-of-illness-request.component.html',
  styleUrls: ['./notification-of-illness-request.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NotificationOfIllnessRequestComponent{
  public startDate : moment.Moment = moment();
  public endDate : moment.Moment = moment();
  public selectedFile: File;

  constructor(private http : HttpNoiService, private ds : DialogService) {}

  onFileSelect(event : any) {
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile.name);
  }

  async onAddClicked(){
    var noi = new NotificationOfIllnessAdd();

    var startDate = this.startDate.toDate();
    var endDate = this.endDate.toDate();
    var noiSDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
    var noiEDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);

    noi.startDate = noiSDate;
    noi.endDate = noiEDate;
    var confirm = await this.ds.showConfirmMessage("Möchten Sie sich wirklich von " + this.getDateAsString(this.startDate) + " bis " + this.getDateAsString(this.endDate) + " krank melden?");
    if(confirm){
      await this.http.addNotificationOfIllness(noi);
      this.ds.showNotificationMessage("Erfolgreich krank gemeldet!");
    }
  }

  public getDateAsString(date :  moment.Moment) : string{
    if(date == null){
      return "";
    }
      return date.toDate().toLocaleDateString();
    }

}
