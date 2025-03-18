import { LineItemInput } from "./lineItemInput";

export class OrderInput{
    totalValue!: number;
    orderDate!: string;
    orderStatus!: number;
    holder!: string;
    note!: string;
    products!: LineItemInput[];

    constructor(
        totalValue: number,
        orderDate: string,
        orderStatus: number,
        holder: string,
        note: string,
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