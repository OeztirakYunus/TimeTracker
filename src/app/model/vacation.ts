import { Employee } from "./employee";

export class Vacation {
    public id : string = "";
    public status : string = "";
    public dateOfRequest : Date = new Date();
    public startDate : Date = new Date();
    public endDate : Date = new Date();
    public employee : Employee = new Employee();
}
