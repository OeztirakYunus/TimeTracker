import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { DialogType, MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from 'src/app/model/employee';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.apiUrl + 'Auth/';
  public role = "";
  constructor(private httpClient: HttpClient, private router: Router, private localStorageService: LocalStorageCache, private jwtService : JwtTokenService, private ds: DialogService) { }

  async login(email: string, password: string): Promise<boolean> {
    var path = 'login';
    var headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(email + ':' + password));

    try {
      var response = await this.httpClient.get<IAuthResponse>(this.url + path,
        { headers }).toPromise();
      var authToken = response === undefined ? "" : response.auth_token;
      this.localStorageService.set('AuthToken', authToken);
      var role = await this.getRole();
      this.localStorageService.set('UserRole', role);
      return true;
    } catch (error : any) {
      this.ds.showErrorMessage(error.message);
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
     this.ds.showErrorMessage(error.error.message);
     return false;
    }
  }

  async logout() {
    try {
      this.localStorageService.remove('AuthToken');
      this.localStorageService.remove('UserRole');
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
  }

  private async getRole(): Promise<string> {  
    if(this.isAuthenticated()){
      var path = 'role';
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
      try {
        var response = await this.httpClient.get<IAuthResponse>(this.url + path,
          { headers }).toPromise();
        var role = response === undefined ? "" : response.role;
        return role;
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
        return "";
      }
    }

    return "User";
  }

  public async getLoggedInUser() : Promise<Employee>{
    var path = "authenticatedUser";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    let employee = new Employee;
    try {   
      let employeeUn = await this.httpClient.get<Employee>(this.url + path, { headers }).toPromise();
      employee = employeeUn === undefined ? new Employee : employeeUn;
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
    finally{
      return employee;
    }
  }

  public isAuthenticated(){
    this.role = localStorage.getItem("UserRole") || "";
    this.role = this.role.replaceAll("\"", "");

    const authToken = localStorage.getItem("AuthToken");
    const isAuth = authToken !== null && !this.jwtService.isTokenExpired(authToken);

    if(!isAuth){
      this.logout();
    }

    return isAuth;
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