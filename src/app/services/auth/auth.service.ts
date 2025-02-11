import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { DialogType, MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from 'src/app/model/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url : string = "http://217.154.74.86/api/Auth/";
  //private url = "https://localhost:5001/api/Auth/";
  public role = "";
  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService, private jwtService : JwtTokenService, private dialog: MatDialog) { }

  async login(email: string, password: string): Promise<boolean> {
    var path = 'login';
    var headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(email + ':' + password));

    try {
      var response = await this.httpClient.get<IAuthResponse>(this.url + path,
        { headers }).toPromise();
      var authToken = response === undefined ? "" : response.auth_token;
      this.cookieService.set('AuthToken', authToken);
      var role = await this.getRole();
      this.cookieService.set('UserRole', role);
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
      this.cookieService.delete('UserRole');
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  private async getRole(): Promise<string> {  
    if(this.isAuthenticated()){
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

    return "User";
  }

  public async getLoggedInUser() : Promise<Employee>{
    var path = "authenticatedUser";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    let employee = new Employee;
    try {   
      let employeeUn = await this.httpClient.get<Employee>(this.url + path, { headers }).toPromise();
      employee = employeeUn === undefined ? new Employee : employeeUn;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return employee;
    }
  }

  public isAuthenticated(){
    this.role = this.cookieService.check("UserRole") ? this.cookieService.get("UserRole") : "";
    var isAuth =  this.cookieService.check("AuthToken") && !this.jwtService.isTokenExpired(this.cookieService.get("AuthToken"));

    if(!isAuth){
      this.logout();
    }

    return isAuth;
  }

  private showErrorMessage(message: string){
    this.dialog.open(MessageDialogComponent, {
      height: 'fit',
      width: 'fit',
      data: {title: "Ein Fehler ist aufgetreten!", content: message, dialogType: DialogType.ERROR}
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