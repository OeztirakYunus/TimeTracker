import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampTimeComponent } from './pages/stamp-time/stamp-time.component';
import { HourListComponent } from './pages/hour-list/hour-list.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { HourListForEmployeeComponent } from './pages/hour-list-for-employee/hour-list-for-employee.component';
import { EditEmployeeComponent } from './pages/employees/edit-employee/edit-employee.component';
import { AddEmployeeComponent } from './pages/employees/add-employee/add-employee.component';
import { VacationRequestComponent } from './pages/vacation-request/vacation-request.component';
import { VacationsComponent } from './pages/vacations/vacations.component';
import { VacationRequestAdminComponent } from './pages/vacation-request-admin/vacation-request-admin.component';

const routes: Routes = [
  { path:'stempeln', component:StampTimeComponent, canActivate:[AuthGuardService] },
  { path:'register', component:RegisterComponent},
  { path:'login', component:LoginComponent},
  { path:'stunden', component:HourListComponent, canActivate:[AuthGuardService]},
  { path:'urlaube', component:VacationsComponent, canActivate:[AuthGuardService]},
  { path:'urlaube/antrag', component:VacationRequestComponent, canActivate:[AuthGuardService]},
  { path:'urlaube/antrag/admin', component:VacationRequestAdminComponent, canActivate:[AuthGuardService],  data: {role: "Admin"}},
  { path:'mitarbeiter', component:EmployeesComponent, canActivate:[AuthGuardService], data: {role: "Admin"}},
  { path:'mitarbeiter/add', component:AddEmployeeComponent, canActivate:[AuthGuardService], data: {role: "Admin"}},
  { path:'mitarbeiter/:id', component:HourListForEmployeeComponent, canActivate:[AuthGuardService], data: {role: "Admin"}},
  { path:'mitarbeiter/edit/:id', component:EditEmployeeComponent, canActivate:[AuthGuardService], data: {role: "Admin"}},
  { path: '', redirectTo: '/stempeln', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
