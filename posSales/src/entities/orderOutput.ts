import { LineItemOutput } from "./lineItemOutput";

export class OrderOutput{
    orderId!: number;
    totalValue!: number;
    orderDate!: string;
    orderStatus!: number;
    holder!: string;
    note!: string;
    userId!: number;
    products!: LineItemOutput[]; 

    constructor(
        orderId: number,
        totalValue: number,
        orderDate: string,
        orderStatus: number,
        holder: string,
        note: string,
        userId: number,
        products: LineItemOutput[]
    ){
        this.orderId = orderId;
        this.totalValue = totalValue;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.holder = holder;
        this.note = note;
        this.userId = userId;
        this.products = products;
    }
}