export class LoginResponse{
    token!: string;
    refreshToken!: string;
    expiration!: string;

    constructor(
        token: string,
        refreshToken: string,
        expiration: string
    ){
        this.token = token;
        this.refreshToken = refreshToken;
        this.expiration = expiration;
    }
}