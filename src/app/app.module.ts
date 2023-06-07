import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StampTimeComponent } from './stamp-time/stamp-time.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material-module';
import { RouterModule } from '@angular/router';
import { HourListComponent } from './hour-list/hour-list.component';


@NgModule({
  declarations: [
    AppComponent,
    StampTimeComponent,
    NavbarComponent,
    HourListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
