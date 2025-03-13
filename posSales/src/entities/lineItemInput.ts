export class LineItemInput{
    productId!: number;
    amount!: number;
    price!: number;

    constructor(
        productId: number,
        amount: number,
        price: number,
    ){
        this.productId = productId;
        this.amount = amount;
        this.price = price;
    }
}