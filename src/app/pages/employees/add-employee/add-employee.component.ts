import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserToAdd } from 'src/app/model/user-to-add';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  data: UserToAdd = {firstName: "", lastName: "", email: "", password: "", phoneNumber: "", numberOfKids: 0, employeeRole: "User", socialSecurityNumber: ""}

  constructor(private http : HttpService, private router : Router) {
  }

  onAddClick(): void {
    this.http.addUser(this.data);
    this.router.navigate(['/mitarbeiter']);
  }
}
