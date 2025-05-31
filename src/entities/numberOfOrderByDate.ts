export class NumberOfOrderByDate{
    date!: string;
    numberOfOrders!: number;

    constructor(
        date: string,
        numberOfOrders: number
    ){
        this.date = date;
        this.numberOfOrders = numberOfOrders;
    }
}