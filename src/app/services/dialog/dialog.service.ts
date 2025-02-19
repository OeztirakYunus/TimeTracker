import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogType, MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog : MatDialog) { }

  public showErrorMessage(message: string){
    this.dialog.open(MessageDialogComponent, {
      height: 'fit',
      width: 'fit',
      data: {title: "Ein Fehler ist aufgetreten!", content: message, dialogType: DialogType.ERROR}
    });
  }

  public showConfirmMessage(message: string): Promise<boolean> {
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

  public showNotificationMessage(message: string){
    this.dialog.open(MessageDialogComponent, {
      height: 'fit',
      width: 'fit',
      data: {title: "Erfolgreich!", content: message, dialogType: DialogType.NOTIFICATION}
    });
  }
}
