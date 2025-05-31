import { Injectable } from '@angular/core';
import * as forge from 'node-forge'

const publicRSAKey: string = `-----BEGIN PUBLIC KEY-----
                              MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ
                              DCqU1vHWDMHHiUofJTdL4TMcetd+6tvtk5MLfx
                              szqPkKoN7f6FrymNeRYpIwarz1QaLVHBcLXbHg
                              D2W8qCVA08esEq8nvr5eAUvaU0HpmDv+lQPp/0
                              LgG4A8HIFVAwLt3PWaef+M5QaVazN/zcxZERLD
                              gxB2E6N+Q17WkjKc8PlwIDAQAB
                              -----END PUBLIC KEY-----` 

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  encryptByRSA(data: string) : string{
    // Set the rsa algo with the public key
    var rsa = forge.pki.publicKeyFromPem(publicRSAKey);
    // Encrypt data => bytes array; Convert the bytes array to base64 string;
    var encryptedPassword = window.btoa(rsa.encrypt(data))

    return encryptedPassword;
  }
}
