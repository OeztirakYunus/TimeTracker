import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface MessageData {
  title : string,
  content: string
  dialogType : DialogType
}

export enum DialogType {
  ERROR = 'error',
  CONFIRM = 'confirm'
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  messageData : MessageData;
  isError : boolean;
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,@Inject(MAT_DIALOG_DATA) messageData : MessageData)
  {
    this.messageData = messageData;
    if(messageData.dialogType === DialogType.ERROR){
      this.isError = true;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Returns true when confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // Returns false when canceled
  }
}