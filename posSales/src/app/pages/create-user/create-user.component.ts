import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../entities/user';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import Toast from 'bootstrap/js/dist/toast';

const successToast = 'Usuario criado com sucesso!';
const failedToast = 'Erro ao criar usuario!';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FormsModule,
    NgxMaskDirective,
    CommonModule
  ],
  providers: [provideNgxMask()],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit{
  isLoading = false;
  isFirstBreakPoint: boolean = window.innerWidth <= 620;
  isSecondBreakPoint: boolean = window.innerWidth <= 540;
  isThirdBreakPoint: boolean = window.innerWidth <= 620;

  name = '';
  email = '';
  cpf = '';
  password = '';
  dateBirth = '';
  user!: User;

  toastMessage = '';

  isNameInvalid = false;
  //isCPFInvalid = false;
  isEmailInvalid = false;
  isPasswordInvalid = false;
  //isDateBirthInvalid = false;

  constructor(
    private userService: UserService
  ){}

  ngOnInit(): void {
  }

  createUser(){
    if(this.name == '' ||
      this.email == '' ||
      this.cpf == '' ||
      this.password == '' ||
      this.dateBirth == ''
    ){
      return;
    }

    this.isLoading = true;
    this.isNameInvalid = false;
    //this.isCPFInvalid = false;
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    //this.isDateBirthInvalid = false;

    this.user = new User(
      0, 
      this.name, 
      this.email, 
      this.password, 
      this.cpf,
      0,
      this.dateBirth.split("/").reverse().join("-"),
      1,
      3
    );

    this.userService.createUser(this.user)
    .subscribe({
      next: (res) => {
        this.showSuccessToast(successToast);
        this.isLoading = false;
        this.name = ''; 
        this.email = ''; 
        this.cpf = ''; 
        this.password = ''; 
        this.dateBirth = '';
      },
      error: (err) => {
        console.log(err);
        this.showFailToast(failedToast);
        this.isLoading = false;
        this.isNameInvalid = true;
        //this.isCPFInvalid = true;
        this.isEmailInvalid = true;
        this.isPasswordInvalid = true;
        //this.isDateBirthInvalid = true;
      }
    })
  }

  cancel(){
    this.name = ''; 
    this.email = ''; 
    this.cpf = ''; 
    this.password = ''; 
    this.dateBirth = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isFirstBreakPoint = window.innerWidth <= 620;
    this.isSecondBreakPoint = window.innerWidth <= 540;
    //console.log(this.isSmallScreen);
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