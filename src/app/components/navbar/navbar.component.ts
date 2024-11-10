import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userIsAdmin : boolean = false;
  public constructor(public auth : AuthService) {
  }

   isLoggedIn() {
    this.userIsAdmin = this.auth.role == "Admin";
    return this.auth.isAuthenticated();
  }

  login(){
    //this.auth.loginWithRedirect();
  }

  async logout(){
    await this.auth.logout();
    location.reload();
  }
}
