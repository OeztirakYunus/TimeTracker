import { Stamp } from "./stamp";

export class WorkDay {
    public startDate : Date = new Date();
    public endDate : Date = new Date();
    public workedHours : number = 0;
    public breakHours : number = 0;
    public stamps : Stamp[] = [];
}
