import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../../entities/loginModel';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    FormsModule 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  isPasswordVisible = false;
  passwordVisibilityType = 'password'

  email = '';
  password = ''
  isEmailInvalid = false;
  isPasswordInvalid = false;
  userNotFound = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  login(){
    if(this.email == '' || this.password == ''){
      this.isEmailInvalid = this.email == '' ? true : false;
      this.isPasswordInvalid = this.password == '' ? true : false;
      return;
    }

    this.authService.login({ 
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        setTimeout(() => {
          this.userNotFound = true;
        });
        console.log('User Not Found? = ' + this.userNotFound)
        console.error(err);
      }
    })

    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
  }

  cancel(){
    this.email = this.password = '';
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordVisibilityType = this.isPasswordVisible == true ? 'text' : 'password'
  }
}
