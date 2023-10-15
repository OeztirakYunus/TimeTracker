import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { WorkDay } from 'src/app/model/work-day';
import { IAuthResponse } from '../auth/auth.service';
import { WorkMonth } from 'src/app/model/work-month';
import { Employee } from 'src/app/model/employee';
import { Stamp } from 'src/app/model/stamp';
import { EmployeeEdit } from 'src/app/model/employee-edit';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Vacation } from 'src/app/model/vacation';
import { VacationAdd } from 'src/app/model/vacation-add';
import { NotificationOfIllness } from 'src/app/model/notification-of-illness';
import { NotificationOfIllnessAdd } from 'src/app/model/notification-of-illness-add';


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
  //private url : string = "https://728ch9w0-5001.euw.devtunnels.ms/api/";
  private url : string = "https://localhost:5001/api/";

  constructor(http: HttpClient, private cookieService : CookieService, private dialog: MatDialog) {
    this.httpClient = http;
  }

  public async getWorkDay() : Promise<WorkDay>{
    var path = "WorkDays/for-employee"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    let workDay = new WorkDay();
    try {   
      let workdayUn = await this.httpClient.get<WorkDay>(this.url + path, { headers }).toPromise();
      if(workdayUn != undefined){
        workDay.startDate = this.parseDate(workdayUn.startDate);
        workDay.stamps = workdayUn.stamps;

        workDay.stamps.forEach(element => {
          element.time = this.parseDate(element.time);
        });

        workDay.workedHours = workdayUn.workedHours;
        workDay.endDate = workdayUn.endDate;
        workDay.vacationDay = workdayUn.vacationDay;
        workDay.breakHours = workdayUn.breakHours;
      }
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
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
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  public async takeABreak() : Promise<void>{
    var path = "Stamps/break"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    
    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  public async getCompanyName() : Promise<string>{
    var path = "Companies/name"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    
    var companyName = "";
    try {   
      let cN = await this.httpClient.get<string>(this.url + path, { headers }).toPromise();
      companyName = cN as string;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return companyName;
    }
  }

  private async getWorkMonthWithPathAndHeaders(path : string, headers : HttpHeaders) : Promise<WorkMonth>
  {
    let workMonth = new WorkMonth();
    try {   
      let workMonthUn = await this.httpClient.get<WorkMonth>(this.url + path, { headers }).toPromise();
      if(workMonthUn != undefined){
        workMonth.date = this.parseDate(workMonthUn.date);
        workMonth.workDays = workMonthUn.workDays;
        workMonth.id = workMonthUn.id;

        if(workMonth.workDays != null){
          workMonth.workDays.forEach(element => {
            element.forEach(t => {
              t.startDate = this.parseDate(t.startDate);
              t.endDate = this.parseDate(t.endDate);
              t.stamps.forEach(i => {
              i.time = this.parseDate(i.time);
            });
            });
          });
        }
        else{
          workMonth.workDays = [];
        }
       
      }
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return workMonth;
    }
  } 

  public async getWorkMonth(pickedDate : Date) : Promise<WorkMonth>{
    var path = "WorkMonths/date/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate();
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var workMonth = await this.getWorkMonthWithPathAndHeaders(path, headers);
    return workMonth;
  }

  public async getWorkMonthForEmployee(pickedDate : Date, employeeId : string) : Promise<WorkMonth>{
    var path = "WorkMonths/date/" + employeeId + "/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate();
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    var workMonth = await this.getWorkMonthWithPathAndHeaders(path, headers);
    return workMonth;
  }

  async getEmployeeById(employeeId : string) {
    var path = "Auth/" + employeeId;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var employee = new Employee();
    try {   
      let employeeUn = await this.httpClient.get<Employee>(this.url + path, { headers }).toPromise();
      employee = employeeUn === undefined ? new Employee() : employeeUn;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return employee;
    }
  }

  async addUser(user : UserToAdd) {
    var path = 'Auth/addUser';
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      await this.httpClient.post<IAuthResponse>(this.url + path, user, {headers}).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  async deleteEmployee(user : Employee) {
    var path = 'Auth/' + user.id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      await this.httpClient.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  public async getEmployees() : Promise<Employee[]>{
    var path = "Auth/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var employees = [] as Employee[];
    try {   
      let employeeUn = await this.httpClient.get<Employee[]>(this.url + path, { headers }).toPromise();
      employees = employeeUn === undefined ? [] : employeeUn;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return employees;
    }
  }

  public async updateStamp(stamp : Stamp) : Promise<void>{
    var path = "Stamps/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    try {   
      await this.httpClient.put<IAuthResponse>(this.url + path, stamp,{ headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  public async updateEmployee(employee : EmployeeEdit) : Promise<void>{
    var path = "Auth/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    try {   
      await this.httpClient.put<IAuthResponse>(this.url + path, employee,{ headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  public async getEmployeeEdit(id : string): Promise<EmployeeEdit> {
    var path = 'Auth/' + id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      var response = await this.httpClient.get<EmployeeEdit>(this.url + path,
        { headers }).toPromise();
      var employee = response === undefined ? new EmployeeEdit() : response;
      return employee;
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
      return new EmployeeEdit();
    }
  }

  public async getAsPdf(workMonth : WorkMonth, employeeId : string, date : Date) : Promise<Blob>{

    var path = "WorkMonths/createPdf/" + employeeId + "/" + workMonth.id + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    headers = headers.set('Accept', 'application/pdf');
    var pdfData = new Blob();
    try {   
      var response = await this.httpClient.get<Blob>(this.url + path, { headers, responseType: 'blob' as 'json' }).toPromise();
      if(response != undefined){
        var fileURL = URL.createObjectURL(response);
        window.open(fileURL, '_blank');
        return response;
      }
    } catch (error : any) {
      console.log(error);
      this.showErrorMessage(error.error.message);
    }
    finally{
      return pdfData;
    }
  }

  async getVacations() {
    var path = "Vacations/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var vacations = [] as Vacation[];
    try {   
      let vacationsUn = await this.httpClient.get<Vacation[]>(this.url + path, { headers }).toPromise();
      vacations = vacationsUn === undefined ? [] : vacationsUn;
      vacations.forEach(element => {
        element.startDate = this.parseDate(element.startDate);
        element.endDate = this.parseDate(element.endDate);
        element.dateOfRequest = this.parseDate(element.dateOfRequest);
      });
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return vacations;
    }
  }

  async getAllVacations() {
    var path = "Vacations/forCompany/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var vacations = [] as Vacation[];
    try {   
      let vacationsUn = await this.httpClient.get<Vacation[]>(this.url + path, { headers }).toPromise();
      vacations = vacationsUn === undefined ? [] : vacationsUn;
      vacations.forEach(element => {
        element.startDate = this.parseDate(element.startDate);
        element.endDate = this.parseDate(element.endDate);
        element.dateOfRequest = this.parseDate(element.dateOfRequest);
      });
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return vacations;
    }
  }

  async addVacation(vacation : VacationAdd) {
    var path = 'Vacations/';
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    headers = headers.set('Accept', 'application/json');
    vacation.status = "0";

    try {
      await this.httpClient.post<IAuthResponse>(this.url + path, vacation, {headers}).toPromise();
    } catch (error : any) {
      console.log(error);
      this.showErrorMessage(error.error.message);
    }
  }


  async confirmVacation(id : string) {
    var path = "Vacations/confirm/" + id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  async rejectVacation(id : string) {
    var path = "Vacations/reject/" + id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  async deleteVacation(vacation : Vacation) {
    var path = 'Vacations/' + vacation.id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {
      await this.httpClient.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  async addNotificationOfIllness(noi : NotificationOfIllnessAdd) {
    var path = 'NotificationOfIllnesses/';
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));
    headers = headers.set('Accept', 'application/json');

    try {
      await this.httpClient.post<IAuthResponse>(this.url + path, noi, {headers}).toPromise();
    } catch (error : any) {
      console.log(error);
      this.showErrorMessage(error.error.message);
    }
  }

  async getNotificationOfIllnesses() {
    var path = "NotificationOfIllnesses/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var nois = [] as NotificationOfIllness[];
    try {   
      let noisUn = await this.httpClient.get<NotificationOfIllness[]>(this.url + path, { headers }).toPromise();
      nois = noisUn === undefined ? [] : noisUn;
      nois.forEach(element => {
        element.startDate = this.parseDate(element.startDate);
        element.endDate = this.parseDate(element.endDate);
      });
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return nois;
    }
  }

  async getAllNois() {
    var path = "NotificationOfIllnesses/forCompany/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    var nois = [] as NotificationOfIllness[];
    try {   
      let noisUn = await this.httpClient.get<NotificationOfIllness[]>(this.url + path, { headers }).toPromise();
      nois = noisUn === undefined ? [] : noisUn;
      nois.forEach(element => {
        element.startDate = this.parseDate(element.startDate);
        element.endDate = this.parseDate(element.endDate);
      });
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
    finally{
      return nois;
    }
  }

  async confirmNoi(id : string) {
    var path = "NotificationOfIllnesses/confirm/" + id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  async rejectNoi(id : string) {
    var path = "NotificationOfIllnesses/reject/" + id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('AuthToken'));

    try {   
      await this.httpClient.get<IAuthResponse>(this.url + path, { headers }).toPromise();
    } catch (error : any) {
      this.showErrorMessage(error.error.message);
    }
  }

  private showErrorMessage(message: string){
    this.dialog.open(MessageDialogComponent, {
      height: 'fit',
      width: 'fit',
      data: {title: "Ein Fehler ist aufgetreten!", content: message}
    });
  }
}