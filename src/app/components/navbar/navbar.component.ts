import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public constructor(public auth : AuthService) {
  }

   isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  login(){
    //this.auth.loginWithRedirect();
  }

  logout(){
    this.auth.logout();
  }
}
