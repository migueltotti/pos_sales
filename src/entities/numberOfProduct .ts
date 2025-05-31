export class NumberOfProduct{
    prodName!: string;
    productCount!: number;

    constructor(
        prodName: string,
        productCount: number
    ){
        this.prodName = prodName;
        this.productCount = productCount;
    }
}