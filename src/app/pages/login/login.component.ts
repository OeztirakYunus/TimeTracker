

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public email : string = "";
  public password : string = "";

  constructor(private auth : AuthService, private router : Router) {
  }
  async ngOnInit() {
    await this.auth.logout();
  }

  async loginClicked(){
    var loggedIn = await this.auth.login(this.email, this.password);
    if(loggedIn){
      this.router.navigate(['/stempeln']);
    }
  }
}

