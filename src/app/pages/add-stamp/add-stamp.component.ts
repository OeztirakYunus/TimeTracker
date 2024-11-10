import { Component } from '@angular/core';
import { Stamp } from 'src/app/model/stamp';

@Component({
  selector: 'app-add-stamp',
  templateUrl: './add-stamp.component.html',
  styleUrls: ['./add-stamp.component.css']
})
export class AddStampComponent {
  private stamp : Stamp = new Stamp();

  getValueForTimePicker(){
    var timeWithSeconds = this.getTime(this.stamp.time);
    var timeSplitted = timeWithSeconds.split(":");
    var time = timeSplitted[0] + ":" + timeSplitted[1];
    return time;
  }

  dateChanged(event : any){
    var hours = this.stamp.time.getHours();
    var minutes = this.stamp.time.getMinutes();
    var seconds = this.stamp.time.getSeconds();

    var dateMoment = event["value"] as moment.Moment;
    this.stamp.time = dateMoment.toDate();
    this.stamp.time.setHours(hours);
    this.stamp.time.setMinutes(minutes);
    this.stamp.time.setSeconds(seconds);
  }

  timeChanged(event : string){
    var time = event.split(":");
    this.stamp.time.setHours(+time[0] - 1)
    this.stamp.time.setMinutes(+time[1])
  }

  public getTime(date : Date){
    return date.toLocaleTimeString();
  }

}
