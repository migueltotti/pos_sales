import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ModalComponent } from '../../modal/modal.component';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { LogoutModalComponent } from '../../logout-modal/logout-modal.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    LogoutModalComponent,
    NgClass
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        console.log(isAuthenticated);
      }
    );
  }

  logout(event: number) {
    if(event == 1){
      this.authService.logoutUser();
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
