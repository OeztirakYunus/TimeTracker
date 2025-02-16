import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogType, MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { Stamp } from 'src/app/model/stamp';
import { WorkDay } from 'src/app/model/work-day';
import { HttpService } from 'src/app/services/http/http.service';

const daysInGerman = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

@Component({
  selector: 'app-stamp-time',
  templateUrl: './stamp-time.component.html',
  styleUrls: ['./stamp-time.component.css']
})
  
export class StampTimeComponent implements OnInit {
  displayedColumns: string[] = ['typeOfStamp', 'time'];
  dataSource : Stamp[] = [];
  dateNow = this.formatDate(new Date());
  workDay : WorkDay = new WorkDay();
  stampButtonText = "Dienstbeginn";
  breakButtonText = "Pause";
  public vacationDay = false;
  public illDay = false;
  private clockElement: HTMLElement;

  constructor(private http : HttpService, private dialog : MatDialog){
  }
  
  async ngOnInit() {
    this.getWorkDay();
    var element = document.getElementById('liveClock');
    if (!element) {
      throw new Error(`Element with id liveClock not found.`);
    }
    this.clockElement = element;
    this.startClock();
  }

  public  formatDate(date : Date) : string {
    var day = date.getDay();
    var dayDate = date.getDate().toString();
    var month = (date.getMonth() + 1).toString();
    var year = date.getFullYear();
    
    if (month.length < 2) 
        month = '0' + month;
    if (dayDate.length < 2) 
        dayDate = '0' + dayDate;

    return daysInGerman[day] + ", " + dayDate + "." + month + "." + year;
  }

  public getTime(date : Date){
    var time = "";
    time = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours().toLocaleString();
    time += ":";
    time += date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes().toLocaleString();
    return time;
  }

  public async takeABreak() {
    var confirmText = "Möchten Sie die Pause beenden?"
    if(this.breakButtonText == "Pause"){
      confirmText = "Möchten Sie die Pause beginnen?";
    }
    var confirm = await this.showConfirmDialog(confirmText);
    if(confirm){
      await this.http.takeABreak();
      await this.getWorkDay();
    }
  }

  public async stamp(){
    var confirmText = "Möchten Sie den Dienst beenden?"
    if(this.stampButtonText == "Dienstbeginn"){
      confirmText = "Möchten Sie den Dienst starten?";
    }
    var confirm = await this.showConfirmDialog(confirmText);

    if(confirm){
      await this.http.stamp();
      await this.getWorkDay();
    }
  }

  private async getWorkDay() {
    this.workDay = await this.http.getWorkDay();
    this.dataSource = this.workDay.stamps;
    if(this.dataSource.some(i => i.typeOfStamp === "Dienstbeginn")){
      this.stampButtonText = "Dienstende";
    }
    else{
      this.stampButtonText = "Dienstbeginn";
    }
    this.dataSource = this.dataSource.sort((a, b) => a.time.getTime() - b.time.getTime());

    for (let index = this.dataSource.length - 1; index >= 0; index--) {
      const element = this.dataSource[index];
      if(element.typeOfStamp == "Pause"){
       this.breakButtonText = "Pause beenden"; 
       return;
      }
      else if(element.typeOfStamp == "PauseEnde"){
        this.breakButtonText = "Pause"; 
        return;
      }
    }
    this.vacationDay = this.workDay.vacationDay;
    this.illDay = this.workDay.illDay;

    if(this.vacationDay || this.illDay){
      this.dataSource = [];
    }
  }

  public getBackgroundColor(typeOfStamp : string){
    switch (typeOfStamp) {
      case "Dienstbeginn":
        return "green";
      case "Dienstende":
        return "red";
      case "Pause":
        return "yellow";
      case "PauseEnde":
        return "green";
      default:
        return "white";
    }   
  }

  private updateClock(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    this.clockElement.innerText = now.toLocaleTimeString('de-DE', options);
}

  private startClock(): void {
      this.updateClock(); // Initialer Aufruf
      setInterval(() => this.updateClock(), 1000);
  }

    private showConfirmDialog(message: string): Promise<boolean> {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        height: 'fit',
        width: 'fit',
        data: { 
          title: "Sind Sie sicher?", 
          content: message, 
          dialogType: DialogType.CONFIRM 
        }
      });
    
      return new Promise<boolean>((resolve) => {
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            resolve(true);  // Benutzer hat bestätigt
          } else {
            resolve(false); // Benutzer hat abgebrochen oder Dialog geschlossen
          }
        });
      });
    }  
  
    private showErrorMessage(message: string){
      this.dialog.open(MessageDialogComponent, {
        height: 'fit',
        width: 'fit',
        data: {title: "Ein Fehler ist aufgetreten!", content: message, dialogType: DialogType.ERROR}
      });
    }
}
