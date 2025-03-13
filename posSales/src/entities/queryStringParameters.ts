export class QueryStringParameters{
    pageSize: number | undefined;
    pageNumber: number | undefined; 

    constructor(pageSize: number, pageNumber: number){
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
    }
}