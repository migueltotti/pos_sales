import { LineItemOutput } from "./lineItemOutput";

export class OrderOutput{
    orderId!: number;
    totalValue!: number;
    orderDate!: string;
    orderStatus!: number;
    userId!: number;
    holder!: string;
    note!: string;
    lineItems!: LineItemOutput[]; 

    constructor(
        orderId: number,
        totalValue: number,
        orderDate: string,
        orderStatus: number,
        userId: number,
        holder: string,
        note: string,
        lineItems: LineItemOutput[]
    ){
        this.orderId = orderId;
        this.totalValue = totalValue;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.userId = userId;
        this.holder = holder;
        this.note = note;
        this.lineItems = lineItems;
    }
}