import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn() {
    // if (this.cookieService.get('AuthToken') == null || this.jwtService.isTokenExpired(this.cookieService.get('AuthToken'))) {
    //   return false;
    // }
    // else {
    //   return true;
    // }
    return false;
  }

  logout(){
    
  }
}
