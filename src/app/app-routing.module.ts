import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampTimeComponent } from './stamp-time/stamp-time.component';
import { HourListComponent } from './hour-list/hour-list.component';

const routes: Routes = [
  { path:'stempeln', component:StampTimeComponent },
  { path:'register', component:StampTimeComponent },
  { path:'login', component:StampTimeComponent},
  { path:'stunden', component:HourListComponent},
  { path: '', redirectTo: '/stempeln', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
