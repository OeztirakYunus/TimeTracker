import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageCache } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { DialogService } from '../../dialog/dialog.service';
import { WorkMonth } from 'src/app/model/work-month';
import { parseDate } from 'src/app/utils/date-functions';
import * as JSZip from 'jszip';
import { Employee } from 'src/app/model/employee';
import { saveAs } from 'file-saver';
import { HttpEmployeeService } from '../employee/http-employee.service';

@Injectable({
  providedIn: 'root'
})
export class HttpWorkmonthService {

    private url = environment.apiUrl + "WorkMonths/";
    constructor(private http: HttpClient, private localStorageService : LocalStorageCache, private ds : DialogService, private employeeHttpService : HttpEmployeeService) { }

      private async getWorkMonthWithPathAndHeaders(path : string, headers : HttpHeaders) : Promise<WorkMonth>
      {
        let workMonth = new WorkMonth();
        try {   
          let workMonthUn = await this.http.get<WorkMonth>(this.url + path, { headers }).toPromise();
          if(workMonthUn != undefined){
            workMonth.date = parseDate(workMonthUn.date);
            workMonth.workDays = workMonthUn.workDays;
            workMonth.id = workMonthUn.id;
    
            if(workMonth.workDays != null){
              workMonth.workDays.forEach(element => {
                element.forEach(t => {
                  t.startDate = parseDate(t.startDate);
                  t.endDate = parseDate(t.endDate);
                  t.stamps.forEach(i => {
                  i.time = parseDate(i.time);
                });
                });
              });
            }
            else{
              workMonth.workDays = [];
            }
           
          }
        } catch (error : any) {
          this.ds.showErrorMessage(error.error.message);
        }
        finally{
          return workMonth;
        }
      } 
    
      public async getWorkMonth(pickedDate : Date) : Promise<WorkMonth>{
        var path = "date/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate();
        var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
        var workMonth = await this.getWorkMonthWithPathAndHeaders(path, headers);
        return workMonth;
      }
    
      public async getWorkMonthForEmployee(pickedDate : Date, employeeId : string) : Promise<WorkMonth>{
        var path = "date/" + employeeId + "/" + pickedDate.getFullYear() + "-" + (pickedDate.getMonth() + 1) + "-" + pickedDate.getDate();
        var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
        var workMonth = await this.getWorkMonthWithPathAndHeaders(path, headers);
        return workMonth;
      }

      public async getAsPdf(workMonth : WorkMonth, employee : Employee, date : Date) : Promise<Blob>{

        var path = "createPdf/" + employee.id + "/" + workMonth.id + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
        headers = headers.set('Accept', 'application/pdf');
        var pdfData = new Blob();
        try {   
          var response = await this.http.get<Blob>(this.url + path, { headers, responseType: 'blob' as 'json' }).toPromise();
          if(response != undefined){
            var fileURL = URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = fileURL;
            var month = date.getMonth().toString();
            if(date.getMonth() <= 8){
              month = "0" + (date.getMonth() + 1);
            }
            a.download = 'Stundenzettel_' + month + date.getFullYear() + '_' + employee.lastName + '_' + employee.firstName + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.open(fileURL, '_blank');
            window.URL.revokeObjectURL(fileURL);
            return response;
          }
        } catch (error : any) {
          this.ds.showErrorMessage(error.error.message);
        }
        finally{
          return pdfData;
        }
      }
    
      public async getAllAsPdf(date : Date) : Promise<void>{
        var employees = await this.employeeHttpService.getEmployees();
        var files : Blob[] = [];
        
        try{
          const zip = new JSZip();
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Monat als zweistellige Zahl formatieren
          const requests = employees.map(async employee => {
            var workMonth = await this.getWorkMonthForEmployee(date, employee.id);
            var path = "createPdf/" + employee.id + "/" + workMonth.id + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            var headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.localStorageService.get('AuthToken'));
            headers = headers.set('Accept', 'application/pdf');
            var pdfData = new Blob();  
              var response = await this.http.get<Blob>(this.url + path, { headers, responseType: 'blob' as 'json' }).toPromise();
              if(response != undefined){
                zip.file(`Stundenzettel_${month}${date.getFullYear()}_${employee.lastName}_${employee.firstName}.pdf`, response);
              }
          });
    
          await Promise.all(requests); // Warte auf alle Requests, bevor ZIP erstellt wird
    
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          saveAs(zipBlob, `Stundenzettel_${month}${date.getFullYear()}_alle_Mitarbeiter.zip`);
        } 
        catch (error : any) {
          this.ds.showErrorMessage(error.error.message);
        }
      }
}
