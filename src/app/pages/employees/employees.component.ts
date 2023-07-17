import { Component, Inject, OnInit } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
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

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'employeeRole', 'actions'];
  dataSource : Employee[] = [];

  constructor(private httpService : HttpService, public dialog : MatDialog, public router : Router){}
  
  async ngOnInit(){
    await this.getEmployees();
  }

  async getEmployees(){
    this.dataSource = await this.httpService.getEmployees();
  }

  openAdd(){
    var dialogRef= this.dialog.open(AddEmployeeDialog, {
      height: '50%',
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getEmployees();
    })
  }

  async deleteEmployee(employee : Employee){
    await this.httpService.deleteEmployee(employee);
    await this.getEmployees();
  }

  editEmployee(employee : Employee){
    console.log(employee)
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
  selector: 'add-employee-dialog',
  templateUrl: 'add-employee-dialog.html',
  styleUrls: ['add-employee-dialog.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
})
export class AddEmployeeDialog {
  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialog>, private http: HttpService
  ) {}

  data: UserToAdd = {firstName: "", lastName: "", email: "", password: "", phoneNumber: "", numberOfKids: 0, employeeRole: "User", socialSecurityNumber: ""}

  onAddClick(): void {
    this.http.addUser(this.data);
    this.dialogRef.close();
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
    public dialogRef: MatDialogRef<AddEmployeeDialog>, private http: HttpService, @Inject(MAT_DIALOG_DATA) data : Employee
  )
  {
    this.employee = data;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}