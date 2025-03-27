import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() Title: string = "";
  @Input() Body: string = "";

  @Output() actionConfirmed = new EventEmitter<number>();
  
  triggerConfirmEvent(){
    this.Title = '';
    this.Body = '';
    this.actionConfirmed.emit(1);
  }

  triggerCancelEvent(){
    this.Title = '';
    this.Body = '';
    this.actionConfirmed.emit(0);
  }
}
