import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-delete-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-user-modal.component.html',
  styleUrl: './delete-user-modal.component.scss'
})
export class DeleteUserModalComponent {
  @ViewChild('userDeleteElement', { static: false }) userDeleteElement!: ElementRef;
  private userDeleteInstance!: Modal;

  @Output() deleteConfirmation = new EventEmitter<number>()
  
  setUserOptions(option: number){
    this.deleteConfirmation.emit(option);
    this.closeModal();
  }

  ngAfterViewInit() {
    this.userDeleteInstance = new Modal(this.userDeleteElement.nativeElement);

    this.userDeleteElement.nativeElement.addEventListener('shown.bs.modal', () => {});
  }

  openModal() {
    this.userDeleteInstance.show(); // Abre o modal
  }

  closeModal() {
    this.userDeleteInstance.hide(); // Fecha o modal
  }
}
