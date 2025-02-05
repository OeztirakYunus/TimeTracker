import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userIsAdmin : boolean = false;
  companyName : String = "";
  public constructor(public auth : AuthService, public http: HttpService)
  {
    this.getCompanyName();
  }

   isLoggedIn() {
    this.getCompanyName();
    this.userIsAdmin = this.auth.role == "Admin";
    return this.auth.isAuthenticated();
  }

  login(){
    //this.auth.loginWithRedirect();
  }

  async getCompanyName(){
    if(this.companyName === "" && this.auth.isAuthenticated()){
      this.companyName = await this.http.getCompanyName();
    }
  }

  async logout(){
    await this.auth.logout();
    location.reload();
  }
}
