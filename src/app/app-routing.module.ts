import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampTimeComponent } from './pages/stamp-time/stamp-time.component';
import { HourListComponent } from './pages/hour-list/hour-list.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  { path:'stempeln', component:StampTimeComponent, canActivate:[AuthGuardService] },
  { path:'register', component:RegisterComponent},
  { path:'login', component:LoginComponent},
  { path:'stunden', component:HourListComponent, canActivate:[AuthGuardService]},
  { path:'mitarbeiter', component:EmployeesComponent, canActivate:[AuthGuardService], data: {role: "Admin"}},
  { path: '', redirectTo: '/stempeln', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
