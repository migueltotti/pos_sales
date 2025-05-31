import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import Toast from 'bootstrap/js/dist/toast';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

const successToast = 'Senha do usario alterada com sucesso!';
const failedToast = 'Erro ao alterar senha do usuario!';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  toastMessage = '';
  isLoading = false;
  isPasswordInvalid = false;
  isFirstBreakPoint: boolean = window.innerWidth <= 620;

  userId!: number;

  newPassword!: string;
  oldPassword!: string;

  isNewPasswordVisible = false;
  newPasswordVisibilityType = 'password';
  isOldPasswordVisible = false;
  oldPasswordVisibilityType = 'password';

  min8Max30Caracters = false;
  oneLowerCaseLetter = false;
  oneUpperCaseLetter = false;
  oneNumber = false;
  oneSpecialCaracter = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    console.log(this.userId);
  }

  changePassword(){
    if(this.oldPassword == '' || this.oldPassword == '')
      return;

    this.isLoading = true;

    this.userService.changeUserPassword(this.userId, this.oldPassword, this.newPassword)
    .subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showSuccessToast(successToast);
        this.router.navigate(['/usuario/config', this.userId]);
      },
      error: (err) => {
        this.isLoading = false;
        this.isPasswordInvalid = true;
        this.showFailToast(failedToast);
      }
    })
  }

  cancel(){
    this.oldPassword = '';
    this.newPassword = '';
    this.isLoading = false;
    this.isPasswordInvalid = false;
  }

  checkPasswordRequirements(){
    this.oneLowerCaseLetter = this.newPassword.search(/^(?=.*[a-z])/) > -1 ? true : false;
    this.oneUpperCaseLetter = this.newPassword.search(/^(?=.*[A-Z])/) > -1 ? true : false;
    this.oneNumber = this.newPassword.search(/^(?=.*[0-9])/) > -1 ? true : false;
    this.oneSpecialCaracter = this.newPassword.search(/^(?=.*[!@#$%^&*()_+])/) > -1 ? true : false;
    this.min8Max30Caracters = (8 <= this.newPassword.length && this.newPassword.length <= 30) ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isFirstBreakPoint = window.innerWidth <= 620;
  }

  toggleOldPasswordVisibility() {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
    this.oldPasswordVisibilityType = this.isOldPasswordVisible == true ? 'text' : 'password'
  }

  toggleNewPasswordVisibility() {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
    this.newPasswordVisibilityType = this.isNewPasswordVisible == true ? 'text' : 'password'
  }

  showSuccessToast(text: string){
    this.toastMessage = text

    const toastElement = document.getElementById('successToast');
    if(toastElement){
        const toast = new Toast(toastElement);
        toast.show();
    }
  }

  showFailToast(text: string){
    this.toastMessage = text

    const toastElement = document.getElementById('failedToast');
    if(toastElement){
        const toast = new Toast(toastElement);
        toast.show();
    }
  }
}
