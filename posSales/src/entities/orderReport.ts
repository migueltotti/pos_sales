import { OrderOutput } from "./orderOutput";

export class OrderReport{
    date!: string;
    ordersCount!: number;
    totalValue!: number;
    orders!: OrderOutput[];

    constructor(
        date: string,
        ordersCount: number,
        totalValue: number,
        orders: OrderOutput[]
    ){
        this.date = date;
        this.ordersCount = ordersCount;
        this.totalValue = totalValue;
        this.orders = orders;
    }
}