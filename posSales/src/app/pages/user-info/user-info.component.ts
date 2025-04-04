import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';
import { AuthService } from '../../../services/auth.service';

const successToast = 'Usuario editado com sucesso!';
const failedToast = 'Erro ao editar usuario!';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
      FormsModule,
      NgxMaskDirective,
      CommonModule
    ],
    providers: [provideNgxMask()],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent implements OnInit{
  isLoading = false;
  isFirstBreakPoint: boolean = window.innerWidth <= 620;
  isSecondBreakPoint: boolean = window.innerWidth <= 540;

  isEditionMode = false;

  name = '';
  email = '';
  cpf = '';
  password = '';
  dateBirth = '';
  user!: User | null;

  toastMessage = '';

  isNameInvalid = false;
  //isCPFInvalid = false;
  isEmailInvalid = false;
  isPasswordInvalid = false;
  //isDateBirthInvalid = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    const userId = this.authService.getUserIdFromStorage();
    
    this.userService.getUserById(userId!)
    .subscribe({
      next: (res) => {
        this.user = res.body;
        this.name = this.user?.name!;
        this.email = this.user?.email!;
        this.cpf = this.user?.cpf!;
        this.password = this.user?.password!;
        this.dateBirth = this.user?.dateBirth.split('T')[0].split('-').reverse().join('-')!;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateUser(){
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
      this.user?.userId!, 
      this.name, 
      this.email, 
      this.password, 
      this.cpf,
      this.user?.points!,
      this.dateBirth.split("/").reverse().join("-"),
      this.user?.affiliateId!,
      this.user?.role!
    );

    this.userService.updateUser(this.user)
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
    this.isEditionMode = false;
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
