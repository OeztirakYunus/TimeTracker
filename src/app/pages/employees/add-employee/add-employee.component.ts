import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserToAdd } from 'src/app/model/user-to-add';
import { HttpEmployeeService } from 'src/app/services/http/employee/http-employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  data: UserToAdd = {firstName: "", lastName: "", email: "", password: "", phoneNumber: "", numberOfKids: 0, employeeRole: "User", socialSecurityNumber: ""}

  constructor(private http : HttpEmployeeService, private router : Router) {
  }

  onAddClick(): void {
    this.http.addUser(this.data);
    this.router.navigate(['/mitarbeiter']);
  }
}
