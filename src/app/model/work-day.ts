import { Stamp } from "./stamp";

export class WorkDay {
    public date : Date = new Date();
    public workedHours : number = 0;
    public stamps : Stamp[] = [];
}
