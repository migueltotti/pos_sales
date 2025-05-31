export class Category{
    categoryId!: number;
    name!: string;
    imageUrl!: string;

    constructor(
        categoryId: number,
        name: string,
        imageUrl: string
    ){
        this.categoryId = categoryId;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}