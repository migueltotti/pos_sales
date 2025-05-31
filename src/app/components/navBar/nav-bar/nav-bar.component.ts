import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { LogoutModalComponent } from '../../logout-modal/logout-modal.component';
import { WorkDayService } from '../../../../services/work-day.service';

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
  isWorkDayInProgress = false;
  isAdmin!: boolean;
  private authSubscription!: Subscription;
  private workDaySubscription!: Subscription;
  private adminSubscription!: Subscription;

  constructor(private authService: AuthService, 
    private router: Router, 
    private workDayService: WorkDayService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        console.log(isAuthenticated);
      }
    );

    this.workDaySubscription = this.workDayService.isWorkDayInProgress$.subscribe(
      (isInProgress) => {
        this.isWorkDayInProgress = isInProgress
        console.log(isInProgress)
      }
    );

    this.adminSubscription = this.authService.isAdmin$.subscribe(
      (isAdmin) => {
        this.isAdmin = isAdmin;
        console.log(isAdmin);
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
