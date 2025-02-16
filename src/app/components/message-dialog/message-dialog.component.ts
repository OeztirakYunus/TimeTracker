import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface MessageData {
  title : string,
  content: string
  dialogType : DialogType
}

export enum DialogType {
  ERROR = 'error',
  CONFIRM = 'confirm',
  NOTIFICATION = 'notification'
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  messageData : MessageData;
  isConfirm : boolean;
  iconString = "";
  className = "material-icons error-icon";

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,@Inject(MAT_DIALOG_DATA) messageData : MessageData)
  {
    this.messageData = messageData;
    switch(messageData.dialogType){
      case DialogType.CONFIRM:
        this.isConfirm = true;
        this.className = "material-icons confirm-icon";
        break;
      case DialogType.ERROR:
        this.iconString = "error_outline";
        this.className = "material-icons error-icon";
        break;
      case DialogType.NOTIFICATION:
        this.iconString = "check_circle_outline";
        this.className = "material-icons notification-icon";
        break;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Returns true when confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // Returns false when canceled
  }
}