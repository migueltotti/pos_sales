import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../../entities/loginModel';
import { HttpStatusCode } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { UserService } from '../../../services/user.service';

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
  userNotAllowed = false;

  email = '';
  password = '';
  isEmailInvalid = false;
  isPasswordInvalid = false;
  userNotFound = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ){}

  login(){
    if(this.email == '' || this.password == ''){
      this.isEmailInvalid = this.email == '' ? true : false;
      this.isPasswordInvalid = this.password == '' ? true : false;
      return;
    }

    this.userNotFound = false;
    this.userNotAllowed = false;
    this.isLoading = true;

    var loginModel = new LoginModel(this.email, this.password)

    this.authService.login(loginModel)
    .pipe(
      switchMap((data) => {
        console.log(this.email)
        return this.userService.getUserByEmail(this.email);
      })
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.email = '';
        this.password = '';
        if(this.authService.isAdminOrEmployee()){
          this.authService.setUserIdToStorage(res.body?.userId!);
          this.router.navigate(['/home']);
        }
        else{
          this.userNotAllowed = true;
        }
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
  }

  cancel(){
    this.email = this.password = '';
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    this.userNotFound = false;
    this.userNotAllowed = false;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordVisibilityType = this.isPasswordVisible == true ? 'text' : 'password'
  }
}
