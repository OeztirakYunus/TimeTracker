import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { DialogService } from '../../dialog/dialog.service';
import { Employee } from 'src/app/model/employee';
import { IAuthResponse } from '../../auth/auth.service';
import { EmployeeEdit } from 'src/app/model/employee-edit';
import { UserToAdd } from 'src/app/model/user-to-add';

@Injectable({
  providedIn: 'root'
})
export class HttpEmployeeService {

   private url = environment.apiUrl + "Auth/";
  constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService) { }

  async getEmployeeById(employeeId : string) {
    var path = employeeId;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    var employee = new Employee();
    try {   
      let employeeUn = await this.http.get<Employee>(this.url + path, { headers }).toPromise();
      employee = employeeUn === undefined ? new Employee() : employeeUn;
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
    finally{
      return employee;
    }
  }

  async addUser(user : UserToAdd) {
    var path = 'addUser';
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    try {
      await this.http.post<IAuthResponse>(this.url + path, user, {headers}).toPromise();
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
  }

  async deleteEmployee(user : Employee) {
    var path = user.id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    try {
      await this.http.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
  }

  public async getEmployees() : Promise<Employee[]>{
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    var employees = [] as Employee[];
    try {   
      let employeeUn = await this.http.get<Employee[]>(this.url, { headers }).toPromise();
      employees = employeeUn === undefined ? [] : employeeUn;
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
    finally{
      return employees;
    }
  }


  public async updateEmployee(employee : EmployeeEdit) : Promise<void>{
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
    try {   
      await this.http.put<IAuthResponse>(this.url, employee,{ headers }).toPromise();
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
  }

  public async getEmployeeEdit(id : string): Promise<EmployeeEdit> {
    var path = id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    try {
      var response = await this.http.get<EmployeeEdit>(this.url + path,
        { headers }).toPromise();
      var employee = response === undefined ? new EmployeeEdit() : response;
      return employee;
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
      return new EmployeeEdit();
    }
  }
}
