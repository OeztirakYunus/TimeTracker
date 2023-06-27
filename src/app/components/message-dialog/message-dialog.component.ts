import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  constructor(public dialog: MatDialog){}
  header = "";
  message = "";

  openDialog(title : string, message : string) {
    this.header = title;
    this.message = message;
    this.dialog.open(MessageDialogComponent);
  }
}
