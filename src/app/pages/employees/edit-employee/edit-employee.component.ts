import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { EmployeeEdit } from 'src/app/model/employee-edit';
import { HttpEmployeeService } from 'src/app/services/http/employee/http-employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent{
  
  employee : EmployeeEdit = new EmployeeEdit();

  constructor(private activatedroute:ActivatedRoute, private http : HttpEmployeeService)
  {
    var employeeId = activatedroute.snapshot.params["id"];
    this.getEmployee(employeeId);
  }

  async getEmployee(id : string){
    this.employee = await this.http.getEmployeeEdit(id);
  }

  async saveBtnClicked(){
    this.http.updateEmployee(this.employee);
  }
}
