import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = "https://localhost:5001/api/Auth/";
  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService, private jwtService : JwtTokenService, private dialog: MatDialog) { }

  async login(email: string, password: string): Promise<boolean> {
    var path = 'login';
    var headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(email + ':' + password));

    try {
      var response = await this.httpClient.get<IAuthResponse>(this.url + path,
        { headers }).toPromise();
      var authToken = response === undefined ? "" : response.auth_token;
      this.cookieService.set('AuthToken', authToken);
      return true;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
      return false;
    }
  }

  async register(companyName: string, firstName: string, lastName: string, email: string, password: string, phoneNumber : string, numberOfKids : number, ssn : string) {
    var path = 'register';
    var user = new User(companyName, firstName, lastName, email, password, phoneNumber, numberOfKids, ssn);

    try {
      await this.httpClient.post<IAuthResponse>(this.url + path, user).toPromise();
      return true;
    } catch (error : any) {
     this.showErrorMessage(error.error.message);
     return false;
    }
  }

  async logout() {
    try {
      this.cookieService.delete('AuthToken');
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  async getRole(): Promise<string> {
    var path = 'role';
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      var response = await this.httpClient.get<IAuthResponse>(this.url + path,
        { headers }).toPromise();
      var role = response === undefined ? "" : response.role;
      return role;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
      return "";
    }
  }

  public isAuthenticated(){
    return this.cookieService.check("AuthToken") && !this.jwtService.isTokenExpired(this.cookieService.get("AuthToken"));
  }

  private showErrorMessage(message: string){
    this.dialog.open(MessageDialogComponent, {
      height: 'fit',
      width: 'fit',
      data: {title: "Ein Fehler ist aufgetreten!", content: message}
    });
  }
}

export interface IAuthResponse {
  role: string;
  auth_token: string
}

class User {
  public constructor(public companyName: string, public firstName: string, public lastName: string, public email: string, public password: string, public phoneNumber : string, public numberOfKids : number, public socialSecurityNumber : string) {
  }
}