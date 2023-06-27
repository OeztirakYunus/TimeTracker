import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface MessageData {
  title : string,
  content: string
}


@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  messageData : MessageData;
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,@Inject(MAT_DIALOG_DATA) messageData : MessageData
  )
  {
    this.messageData = messageData;
  }
}
