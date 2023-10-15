export class Employee {
    public firstName : string = "";
    public lastName : string = "";
    public employeeRole : string = "";
    public email : string = "";
    public phoneNumber : string = "";
    public socialSecurityNumber : string = "";
    public numberOfKids : number = 0;
    public id : string = "";
    public companyId : string = "";

    public toString = () : string => {
        return this.lastName + " " + this.firstName;
    }
}
