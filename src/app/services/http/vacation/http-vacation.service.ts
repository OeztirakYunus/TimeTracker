import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { Vacation } from 'src/app/model/vacation';
import { DialogService } from '../../dialog/dialog.service';
import { environment } from 'src/environments/environment';
import { parseDate } from 'src/app/utils/date-functions';
import { VacationAdd } from 'src/app/model/vacation-add';
import { IAuthResponse } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpVacationService {

  private url = environment.apiUrl + "Vacations/";
  constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService) { }

  async getVacations() {
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    var vacations = [] as Vacation[];
    try {   
      let vacationsUn = await this.http.get<Vacation[]>(this.url, { headers }).toPromise();
      vacations = vacationsUn === undefined ? [] : vacationsUn;
      vacations.forEach(element => {
        element.startDate = parseDate(element.startDate);
        element.endDate = parseDate(element.endDate);
        element.dateOfRequest = parseDate(element.dateOfRequest);
      });
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
    finally{
      return vacations;
    }
  }

  async getAllVacations() {
    var path = "forCompany/";
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    var vacations = [] as Vacation[];
    try {   
      let vacationsUn = await this.http.get<Vacation[]>(this.url + path, { headers }).toPromise();
      vacations = vacationsUn === undefined ? [] : vacationsUn;
      vacations.forEach(element => {
        element.startDate = parseDate(element.startDate);
        element.endDate = parseDate(element.endDate);
        element.dateOfRequest = parseDate(element.dateOfRequest);
      });
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
    finally{
      return vacations;
    }
  }


    async addVacation(vacation : VacationAdd) {
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
      headers = headers.set('Accept', 'application/json');
      vacation.status = "0";
  
      try {
        await this.http.post<IAuthResponse>(this.url, vacation, {headers}).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
  
    async confirmVacation(id : string) {
      var path = "confirm/" + id;
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    async rejectVacation(id : string) {
      var path = "reject/" + id;
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    async deleteVacation(vacation : Vacation) {
      var path = vacation.id;
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      try {
        await this.http.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }  
}
