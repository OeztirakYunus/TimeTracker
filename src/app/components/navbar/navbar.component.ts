import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpCompanyService } from 'src/app/services/http/company/http-company.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userIsAdmin : boolean = false;
  companyName : String = "";
  public constructor(public auth : AuthService, public http: HttpCompanyService)
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
