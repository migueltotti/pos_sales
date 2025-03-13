import { LineItemInput } from "./lineItemInput";

export class OrderInput{
    totalValue!: number;
    orderDate!: string;
    orderStatus!: number;
    holder!: string;
    note!: string;
    products!: LineItemInput[];

    constructor(
        orderId: number,
        totalValue: number,
        orderDate: string,
        orderStatus: number,
        holder: string,
        note: string,
        userId: number,
        products: LineItemInput[]
    ){
        this.totalValue = totalValue;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.holder = holder;
        this.note = note;
        this.products = products;
    }
}