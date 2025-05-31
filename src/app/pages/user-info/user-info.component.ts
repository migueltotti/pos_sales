import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';
import { AuthService } from '../../../services/auth.service';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  private adminSubscription!: Subscription
  isAdmin!: boolean;

  isLoading = false;
  isFirstBreakPoint: boolean = window.innerWidth <= 620;
  isSecondBreakPoint: boolean = window.innerWidth <= 540;

  isEditionMode = false;

  userId!: number;
  name = '';
  email = '';
  cpf = '';
  password = '';
  role = 0;
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
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.adminSubscription = this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.isAdmin = isAdmin;
        console.log(isAdmin);
      }
    );

    this.userId = this.route.snapshot.params['id'];

    if(this.userId && this.isAdmin){
      this.getUser(this.userId!);
    }
    else{
      const userIdLogged = this.authService.getUserIdFromStorage();
      this.getUser(userIdLogged!);
    }
  }

  getUser(userId: number){
    this.userService.getUserById(userId!)
    .subscribe({
      next: (res) => {
        this.user = res.body;
        this.name = this.user?.name!;
        this.email = this.user?.email!;
        this.cpf = this.user?.cpf!;
        this.password = this.user?.password!;
        this.role = this.user?.role!;
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

    let day = this.dateBirth.slice(0, 2)
    let month = this.dateBirth.slice(2, 4)
    let year = this.dateBirth.slice(4, 8)

    this.user = new User(
      this.user?.userId!, 
      this.name, 
      this.email, 
      this.password, 
      this.cpf,
      this.user?.points!,
      `${year}-${month}-${day}`,
      this.user?.affiliateId!,
      this.role
    );

    this.userService.updateUser(this.user)
    .pipe(
      switchMap((data) =>{
        return this.userService.getUserById(this.user?.userId!)
      })
    ).subscribe({
      next: (res) => {
        this.showSuccessToast(successToast);
        this.isLoading = false;
        this.user = res.body;
        this.name = this.user?.name!;
        this.email = this.user?.email!;
        this.cpf = this.user?.cpf!;
        this.password = this.user?.password!;
        this.role = this.user?.role!;
        this.dateBirth = this.user?.dateBirth.split('T')[0].split('-').reverse().join('-')!;
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

  navigateToChangePassword(){
    console.log(this.user?.userId);
    this.router.navigate(['/usuario/alterarSenha', this.user?.userId]);
    
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
