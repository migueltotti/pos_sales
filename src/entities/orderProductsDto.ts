import { LineItemInput } from "./lineItemInput";
import { Product } from "./product";

export class OrderProducts{
    product!: Product;
    lineItem!: LineItemInput;

    constructor(
        product: Product,
        lineItem: LineItemInput
    ){
        this.product = product;
        this.lineItem = lineItem;
    }
}