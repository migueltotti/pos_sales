import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/user.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserOptionsModalComponent } from '../../components/user-options-modal/user-options-modal.component';
import { Router } from '@angular/router';
import { DeleteUserModalComponent } from "../../components/delete-user-modal/delete-user-modal.component";
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgxMaskPipe,
    UserOptionsModalComponent,
    DeleteUserModalComponent
],
  providers: [provideNgxMask()],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit{
  @ViewChild('userOptionsModal') userOptionsModal!: UserOptionsModalComponent;
  @ViewChild('userDeleteModal') userDeleteModal!: UserOptionsModalComponent;
  
  isLoading = false;

  users_list: User[] = [];
  userId = 0;

  roles = new Map<number, string>([
    [0, 'Cliente'],
    [1, 'Empregado'],
    [2, 'Administrador'],
  ]);

  constructor(
    private userService: UserService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.isLoading = true;

    this.userService.getAllUsers()
    .subscribe({
      next: (res) => {
        this.users_list = res.body || []
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    })
  }

  openUserOptionsModal(id: number){
    this.userId = id;
    this.userOptionsModal.openModal();
  }

  catchEvent(option: number){
    if(this.userId != 0){
      if(option == 1){
        this.router.navigate(['/usuario/config', this.userId])
      }
      else{
        this.userDeleteModal.openModal();
      }
    }
  }

  catchDeleteEvent(option: number){
    if(this.userId != 0 && option == 1){
      this.userService.deleteUser(this.userId)
      .pipe(
        switchMap(() => {
          return this.userService.getAllUsers()
        })
      ).subscribe({
        next: (res) => {
          this.users_list = res.body || []
          this.isLoading = false;
          this.userId = 0;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.userId = 0;
        }
      })
    }
  }
}
