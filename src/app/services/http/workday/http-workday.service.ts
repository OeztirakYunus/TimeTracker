import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { DialogService } from '../../dialog/dialog.service';
import { WorkDay } from 'src/app/model/work-day';
import { environment } from 'src/environments/environment';
import { parseDate } from 'src/app/utils/date-functions';
import { IAuthResponse } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpWorkdayService {

  private url = environment.apiUrl + "WorkDays/";
  constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService) { }

   public async getWorkDay() : Promise<WorkDay>{
      var path = "for-employee"
      var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
  
      let workDay = new WorkDay();
      try {   
        let workdayUn = await this.http.get<WorkDay>(this.url + path, { headers }).toPromise();
        if(workdayUn != undefined){
          workDay.startDate = parseDate(workdayUn.startDate);
          workDay.stamps = workdayUn.stamps;
  
          workDay.stamps.forEach(element => {
            element.time = parseDate(element.time);
          });
  
          workDay.workedHours = workdayUn.workedHours;
          workDay.endDate = workdayUn.endDate;
          workDay.vacationDay = workdayUn.vacationDay;
          workDay.illDay = workdayUn.illDay;
          workDay.breakHours = workdayUn.breakHours;
        }
      } catch (error : any) {
        this.ds.showErrorMessage(error.error.message);
      }
      finally{
        return workDay;
      }
  }

  async deleteWorkDay(id : string) {
    var path = id;
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));

    try {
      await this.http.delete<IAuthResponse>(this.url + path, {headers}).toPromise();
    } catch (error : any) {
      this.ds.showErrorMessage(error.error.message);
    }
  }
}
