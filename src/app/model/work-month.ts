import { WorkDay } from "./work-day";

export class WorkMonth {
    public id : string = "";
    public date : Date = new Date();
    public workedHours : number = 0;
    public breakHours : number = 0;
    public workDays : WorkDay[][] = [];
}
