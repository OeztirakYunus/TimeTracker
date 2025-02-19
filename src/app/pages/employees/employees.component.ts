import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserToAdd } from 'src/app/model/user-to-add';
import { Employee } from 'src/app/model/employee';
import { Router } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpEmployeeService } from 'src/app/services/http/employee/http-employee.service';
import { HttpWorkmonthService } from 'src/app/services/http/workmonth/http-workmonth.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'employeeRole', 'actions'];
  dataSource = new MatTableDataSource([] as Employee[]);
  pickedDate : moment.Moment = moment();

  constructor(private httpEmployee : HttpEmployeeService, private httpWorkMonth : HttpWorkmonthService, public dialog : MatDialog, public router : Router){}
  
  async ngOnInit(){
    await this.getEmployees();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getAllAsPdf(){
    await this.httpWorkMonth.getAllAsPdf(this.pickedDate.toDate());
  }

  async getEmployees(){
    var data = await this.httpEmployee.getEmployees();
    this.dataSource = new MatTableDataSource(data);
  }

  openAdd(){
    this.router.navigate(['/mitarbeiter/hinzufuegen']);
  }

  async deleteEmployee(employee : Employee){
    await this.httpEmployee.deleteEmployee(employee);
    await this.getEmployees();
  }

  editEmployee(employee : Employee){
    this.router.navigate(['/mitarbeiter/bearbeiten/' + employee.id]);
  }
  
  viewHours(employee : Employee){
    this.router.navigate(['/mitarbeiter/' + employee.id]);
  }

  detailsEmployee(employee : Employee){
    var dialogRef= this.dialog.open(DetailEmployeeDialog, {
      height: 'fit',
      width: 'fit',
      data: employee
    });

    dialogRef.afterClosed().subscribe(async () => {
      await this.getEmployees();
    })
  }
}

@Component({
  selector: 'detail-employee-dialog',
  templateUrl: 'detail-employee-dialog.html',
  styleUrls: ['detail-employee-dialog.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class DetailEmployeeDialog {
  employee : Employee;
  constructor(
    public dialogRef: MatDialogRef<DetailEmployeeDialog>, private http: HttpEmployeeService, @Inject(MAT_DIALOG_DATA) data : Employee
  )
  {
    this.employee = data;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}