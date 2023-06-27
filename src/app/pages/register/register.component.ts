import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public firstName : string = "";
  public lastName : string = "";
  public email : string = "";
  public password : string = "";
  public passwordConfirm : string = "";
  public companyName : string = "";
  public ssn : string = "";
  public phoneNumber : string = "";
  public numberOfKids : number = 0;

  constructor(private auth : AuthService, private router : Router) {
    
  }

  async registerClicked(){
    var registered = await this.auth.register(this.companyName, this.firstName, this.lastName, this.email, this.password, this.phoneNumber, this.numberOfKids, this.ssn);
    if(registered){
      this.router.navigate(['/login']);
    }
  }
}
