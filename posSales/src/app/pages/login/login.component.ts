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
  isLoading = false;

  email = '';
  password = '';
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

    this.userNotFound = false;
    this.isLoading = true;

    this.authService.login({ 
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        setTimeout(() => {
          this.userNotFound = true;
        });
        console.log('User Not Found? = ' + this.userNotFound)
        console.error(err);
      }
    })

    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    this.email = '';
    this.password = '';
  }

  cancel(){
    this.email = this.password = '';
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    this.userNotFound = false;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordVisibilityType = this.isPasswordVisible == true ? 'text' : 'password'
  }
}
