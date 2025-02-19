import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { DialogService } from '../../dialog/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class HttpCompanyService {

  private url = environment.apiUrl + "Companies/";
  constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService) { }
  

  public async getCompanyName() : Promise<string>{
    var path = "name"
    var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
    
    var companyName = "";
    try {   
      var cN = await this.http.get(this.url + path, { headers, responseType: 'text' }).toPromise();
      companyName = cN == null ? "" : cN;
    } catch (error : any) {
      this.ds.showErrorMessage(error.message);
    }
    finally{
      return companyName;
    }
  }
}
