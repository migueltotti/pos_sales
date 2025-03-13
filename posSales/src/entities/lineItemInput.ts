export class LineItemInput{
    lineItemId!: number;
    orderId!: number;
    productId!: number;
    amount!: number;
    price!: number;

    constructor(
        lineItemId: number,
        orderId: number,
        productId: number,
        amount: number,
        price: number,
    ){
        this.lineItemId = lineItemId;
        this.orderId = orderId;
        this.productId = productId;
        this.amount = amount;
        this.price = price;
    }
}