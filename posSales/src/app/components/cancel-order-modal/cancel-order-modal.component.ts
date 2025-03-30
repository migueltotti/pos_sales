import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-order-modal',
  standalone: true,
  imports: [],
  templateUrl: './cancel-order-modal.component.html',
  styleUrl: './cancel-order-modal.component.scss'
})
export class CancelOrderModalComponent {
  modalTitle = "Cancelar Pedido"
  modalBody1 = "Tem certeza que deseja cancelar e excluir o pedido?"
  modalBody2 = "Essa ação não pode ser desfeita!"

  @Output() actionConfirmed = new EventEmitter<number>();
    
  triggerConfirmEvent(){
    this.actionConfirmed.emit(1);
  }

  triggerCancelEvent(){
    this.actionConfirmed.emit(0);
  }
}
