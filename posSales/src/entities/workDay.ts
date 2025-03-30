import { User } from "./user";

export class WorkDay{
    workDayId!: number;
    employeeId!: number;
    employeeName!: string;
    employee!: User;
    startDayTime!: string;
    finishDayTime!: string;
    numberOfOrders!: number;
    numberOfCanceledOrders!: number;

    constructor(
        workDayId: number,
        employeeId: number,
        employeeName: string,
        employee: User,
        startDayTime: string,
        finishDayTime: string,
        numberOfOrders: number,
        numberOfCanceledOrders: number
    ){
        this.workDayId = workDayId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employee = employee;
        this.startDayTime = startDayTime;
        this.finishDayTime = finishDayTime;
        this.numberOfOrders = numberOfOrders;
        this.numberOfCanceledOrders = numberOfCanceledOrders;
    }
}