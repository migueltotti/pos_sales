import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../entities/user';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import Toast from 'bootstrap/js/dist/toast';
import { Role } from '../../../entities/role';
import { EncryptService } from '../../../services/encrypt.service';

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
  isPasswordVisible = false;
  PasswordVisibilityType = 'password'

  roleOptions = [
    { label: 'Cliente', value: Role.CLIENT },
    { label: 'Empregado', value: Role.EMPLOYEE },
    { label: 'Administrador', value: Role.ADMIN }
  ];

  name = '';
  email = '';
  cpf = '';
  password = '';
  role: number = 0;
  dateBirth = '';
  user!: User;

  toastMessage = '';

  isNameInvalid = false;
  //isCPFInvalid = false;
  isEmailInvalid = false;
  isPasswordInvalid = false;
  //isDateBirthInvalid = false;

  constructor(
    private userService: UserService,
    private encryptService: EncryptService
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
    
    let day = this.dateBirth.slice(0, 2)
    let month = this.dateBirth.slice(2, 4)
    let year = this.dateBirth.slice(4, 8)

    this.user = new User(
      0, 
      this.name, 
      this.email, 
      this.encryptService.encryptByRSA(this.password), 
      this.cpf,
      0,
      `${year}-${month}-${day}`,
      1,
      this.role
    );

    console.log(this.user);
    console.log(typeof(this.role))

    this.userService.createUser(this.user)
    .subscribe({
      next: (res) => {
        if(res.ok){
          this.showSuccessToast(successToast);
          this.isLoading = false;
          this.cancel()
        }
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
    this.role = 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isFirstBreakPoint = window.innerWidth <= 620;
    this.isSecondBreakPoint = window.innerWidth <= 540;
    //console.log(this.isSmallScreen);
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.PasswordVisibilityType = this.isPasswordVisible == true ? 'text' : 'password'
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