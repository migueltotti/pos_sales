import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-user-options-modal',
  standalone: true,
  imports: [],
  templateUrl: './user-options-modal.component.html',
  styleUrl: './user-options-modal.component.scss'
})
export class UserOptionsModalComponent {
  @ViewChild('userOptionsElement', { static: false }) userOptionsElement!: ElementRef;
  private userOptionsInstance!: Modal;

  @Output() userOption = new EventEmitter<number>()
  
  setUserOptions(option: number){
    this.userOption.emit(option);
    this.closeModal();
  }

  ngAfterViewInit() {
    this.userOptionsInstance = new Modal(this.userOptionsElement.nativeElement);

    this.userOptionsElement.nativeElement.addEventListener('shown.bs.modal', () => {});
  }

  openModal() {
    this.userOptionsInstance.show(); // Abre o modal
  }

  closeModal() {
    this.userOptionsInstance.hide(); // Fecha o modal
  }
}
