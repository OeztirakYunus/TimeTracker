import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { WorkDay } from 'src/app/model/work-day';
import { IAuthResponse } from '../auth/auth.service';
import { WorkMonth } from 'src/app/model/work-month';
import { Employee } from 'src/app/model/employee';


export interface UserToAdd {
  firstName: string;
  lastName: string;
  email: string;
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpClient: HttpClient;
  private url : string = "https://localhost:5001/api/";

  constructor(http: HttpClient, private cookieService : CookieService) {
    this.httpClient = http;
  }

  public getAuthTest(){
    var path = "Companies/auth-test";
    this.httpClient.get(this.url + path).subscribe(result => console.log(result));
  
  }

  public async getWorkDay() : Promise<WorkDay>{
    var path = "WorkDays/for-employee"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    let workDay = new WorkDay();
    try {   
      let workdayUn = await this.httpClient.get<WorkDay>(this.url + path, { headers }).toPromise();
      if(workdayUn != undefined){
        workDay.date = this.parseDate(workdayUn.date);
        workDay.stamps = workdayUn.stamps;

        workDay.stamps.forEach(element => {
          element.time = this.parseDate(element.time);
        });

        workDay.workedHours = workdayUn.workedHours;
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      return workDay;
    }
  }

  private parseDate(date : Date){
    var fullDateSplitted = date.toString().split('T');
    var dateSplitted = fullDateSplitted[0].split('-');
    var timeSplitted = fullDateSplitted[1].split(':');

    var newDate = new Date();
    newDate.setFullYear(+dateSplitted[0]);
    newDate.setMonth(+dateSplitted[1] - 1);
    newDate.setDate(+dateSplitted[2]);
    newDate.setHours(+timeSplitted[0]);
    newDate.setMinutes(+timeSplitted[1]);
    newDate.setSeconds(+timeSplitted[2]);

    return newDate;
  }


  public async stamp() : Promise<void>{
    var path = "Stamps/stamp"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    
    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error) {
      console.log(error)
    }
  }

  public async takeABreak() : Promise<void>{
    var path = "Stamps/break"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    
    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error) {
      console.log(error)
    }
  }

  public async getCompanyName() : Promise<string>{
    var path = "Companies/name"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    
    var companyName = "";
    try {   
      let cN = await this.httpClient.get<string>(this.url + path, { headers }).toPromise();
      companyName = cN as string;
    } catch (error) {
      console.log(error)
    }
    finally{
      return companyName;
    }
  }

  public async getWorkMonth(pickedDate : Date) : Promise<WorkMonth>{
    var path = "WorkMonths/date/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate();
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    let workMonth = new WorkMonth();
    try {   
      let workMonthUn = await this.httpClient.get<WorkMonth>(this.url + path, { headers }).toPromise();
      if(workMonthUn != undefined){
        workMonth.date = this.parseDate(workMonthUn.date);
        workMonth.workDays = workMonthUn.workDays;

        workMonth.workDays.forEach(element => {
          element.date = this.parseDate(element.date);
          element.stamps.forEach(i => {
            i.time = this.parseDate(i.time);
          });
        });
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      return workMonth;
    }
  }

  async addUser(user : UserToAdd) {
    var path = 'Auth/addUser';
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      await this.httpClient.post<IAuthResponse>(this.url + path, user, {headers}).toPromise();
    } catch (error : any) {
      console.log(error)
    }
  }

  async deleteEmployee(user : Employee) {
    var path = 'Auth/' + user.id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      await this.httpClient.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
    } catch (error : any) {
      console.log(error)
    }
  }

  public async getEmployees() : Promise<Employee[]>{
    var path = "Auth/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var employees = [] as Employee[];
    try {   
      let employeeUn = await this.httpClient.get<Employee[]>(this.url + path, { headers }).toPromise();
      employees = employeeUn === undefined ? [] : employeeUn;
    } catch (error) {
      console.log(error)
    }
    finally{
      return employees;
    }
  }
}