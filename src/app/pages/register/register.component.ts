import { Component } from '@angular/core';
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

  constructor(private auth : AuthService) {
    
  }

  registerClicked(){
    this.auth.register(this.companyName, this.firstName, this.lastName, this.email, this.password);
  }
}
