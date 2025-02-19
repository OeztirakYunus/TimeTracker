import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { DialogService } from '../../dialog/dialog.service';
import { environment } from 'src/environments/environment';
import { IAuthResponse } from '../../auth/auth.service';
import { Stamp } from 'src/app/model/stamp';

@Injectable({
  providedIn: 'root'
})
export class HttpStampService {

  private url = environment.apiUrl + "Stamps/";

  constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService) { }

  public async stamp() : Promise<void>{
      var path = "stamp"
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
      
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    public async stampManually(employeeId : string, pickedDate : Date) : Promise<void>{
      var path = "stamp/" + employeeId + "/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate();
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
      
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    public async takeABreak() : Promise<void>{
      var path = "break"
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
      
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }
  
    public async takeABreakManually(employeeId : string, pickedDate : Date) : Promise<void>{
      var path = "break/" + employeeId + "/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate()
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
      
      try {   
        await this.http.get<IAuthResponse>(this.url + path, { headers }).toPromise();
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
    }

     public async updateStamp(stamp : Stamp) : Promise<void>{
        var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
        try {   
          await this.http.put<IAuthResponse>(this.url, stamp,{ headers }).toPromise();
        } catch (error : any) {
          this.ds.showErrorMessage(error.error.message);
        }
      }
    
      public async updateStamps(stamp : Array<Stamp>) : Promise<void>{
        var path = "updateMany";
        var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
        try {   
          await this.http.put<IAuthResponse>(this.url + path, stamp,{ headers }).toPromise();
        } catch (error : any) {
          this.ds.showErrorMessage(error.error.message);
        }
      }
  
}
