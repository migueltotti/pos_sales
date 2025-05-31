import { LineItemInput } from "./lineItemInput";

export class OrderUpdate{
    orderId!: number;
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
        products: LineItemInput[]
    ){
        this.orderId = orderId;
        this.totalValue = totalValue;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.holder = holder;
        this.note = note;
        this.products = products;
    }
}