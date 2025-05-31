import { Product } from "./product";

export class LineItemOutput{
    lineItemId!: number;
    orderId!: number;
    productId!: number;
    amount!: number;
    price!: number;
    product!: Product;

    constructor(
        lineItemId: number,
        orderId: number,
        productId: number,
        amount: number,
        price: number,
        product: Product
    ){
        this.lineItemId = lineItemId;
        this.orderId = orderId;
        this.productId = productId;
        this.amount = amount;
        this.price = price;
        this.product = product;
    }
}