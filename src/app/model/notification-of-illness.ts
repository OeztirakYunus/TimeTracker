import { Employee } from "./employee";

export class NotificationOfIllness {
    public id : string = "";
    public startDate : Date = new Date();
    public endDate : Date = new Date();
    public isConfirmed : boolean = false;
    public confirmationFile : number[] | null = null;
    public employee : Employee = new Employee();
}
