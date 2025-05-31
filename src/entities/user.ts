export class User {
    userId!: number;
    name!: string;
    email!: string;
    password!: string;
    cpf!: string;
    points!: number;
    dateBirth!: string;
    affiliateId!: number;
    role!: number;

    constructor(
        userId: number,
        name: string,
        email: string,
        password: string,
        cpf: string,
        points: number,
        dateBirth: string,
        affiliateId: number,
        role: number
    ){
        this.userId = userId,
        this.name = name,
        this.email = email,
        this.password = password,
        this.cpf = cpf,
        this.points = points,
        this.dateBirth = dateBirth,
        this.affiliateId = affiliateId,
        this.role = role
    }
}