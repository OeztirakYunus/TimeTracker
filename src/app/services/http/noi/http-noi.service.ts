import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { DialogService } from '../../dialog/dialog.service';
import { NotificationOfIllness } from 'src/app/model/notification-of-illness';
import { environment } from 'src/environments/environment';
import { IAuthResponse } from '../../auth/auth.service';
import { parseDate } from 'src/app/utils/date-functions';
import { NotificationOfIllnessAdd } from 'src/app/model/notification-of-illness-add';

@Injectable({
  providedIn: 'root'
})
export class HttpNoiService {

  private url = environment.apiUrl + "NotificationOfIllnesses/";
  constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService) { }

  async addNotificationOfIllness(noi : NotificationOfIllnessAdd) {
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
    headers = headers.set('Accept', 'application/json');

    try {
      await this.http.post<IAuthResponse>(this.url, noi, {headers}).toPromise();
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
  }

   async getNotificationOfIllnesses() {
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      var nois = [] as NotificationOfIllness[];
      try {   
        let noisUn = await this.http.get<NotificationOfIllness[]>(this.url, { headers }).toPromise();
        nois = noisUn === undefined ? [] : noisUn;
        nois.forEach(element => {
          element.startDate = parseDate(element.startDate);
          element.endDate = parseDate(element.endDate);
        });
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
      finally{
        return nois;
      }
    }
  
    async getAllNois() {
      var path = "forCompany/";
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      var nois = [] as NotificationOfIllness[];
      try {   
        let noisUn = await this.http.get<NotificationOfIllness[]>(this.url + path, { headers }).toPromise();
        nois = noisUn === undefined ? [] : noisUn;
        nois.forEach(element => {
          element.startDate = parseDate(element.startDate);
          element.endDate = parseDate(element.endDate);
        });
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
      finally{
        return nois;
      }
    }
  
    async confirmNoi(id : string) {
      var path = "confirm/" + id;
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    async rejectNoi(id : string) {
      var path = "reject/" + id;
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    async deleteNoi(noi : NotificationOfIllness) {
      var path = noi.id;
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      try {
        await this.http.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
}
