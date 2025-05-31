import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WorkDayService } from './work-day.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class WorkDayGuard implements CanActivate {
  isWorkDayInProgress = false;
  private workDaySubscription!: Subscription;

  constructor(
    private router: Router,
    private workDayService: WorkDayService
  ) {
    this.workDaySubscription = workDayService.isWorkDayInProgress$.subscribe(
      (isInProgress) => this.isWorkDayInProgress = isInProgress
    )
  }

  canActivate(): boolean {
    if (!this.isWorkDayInProgress) {
      this.router.navigate(['/home']); // Redireciona para a pagina Home caso o dia de trabalho não esteja em progresso
      return false;
    }

    return true; // Permite o acesso se estiver o dia de trabalho esteja em progresso
  }
}
