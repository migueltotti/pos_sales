import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.scss'
})
export class LogoutModalComponent {
  modalTitle = "LogOut"
  modalBody = "Tem certeza que deseja fazer logout?"

  @Output() actionConfirmed = new EventEmitter<number>();
    
  triggerConfirmEvent(){
    this.actionConfirmed.emit(1);
  }

  triggerCancelEvent(){
    this.actionConfirmed.emit(0);
  }
}
