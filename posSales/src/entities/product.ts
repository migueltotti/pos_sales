export class Product{
    productId!: number; 
    name!: string;
    description!: string;
    value!: number;
    typeValue!: number;
    stockQuantity!: number;
    imageUrl!: string;
    categoryId!: number;

    constructor(
        productId: number,
        name: string,
        description: string,
        value: number,
        typeValue: number,
        stockQuantity: number,
        imageUrl: string,
        categoryId: number
    ){
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.value = value;
        this.typeValue = typeValue;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
    }
}