import { Component, ElementRef, EventEmitter, NgModule, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-holder-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './holder-modal.component.html',
  styleUrl: './holder-modal.component.scss'
})
export class HolderModalComponent{
  @ViewChild('textElement', { static: false }) textElement!: ElementRef;
  private textInstance!: Modal;
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  @Output() holderName = new EventEmitter<string>();
  name: string = '';

  setHolderName(){
    this.holderName.emit(this.name);
    this.closeModal();
  }

  ngAfterViewInit() {
    this.textInstance = new Modal(this.textElement.nativeElement);

    this.textElement.nativeElement.addEventListener('shown.bs.modal', () => {
      this.nameInput.nativeElement.focus();
    });
  }

  openModal() {
    this.textInstance.show(); // Abre o modal
  }

  closeModal() {
    this.textInstance.hide(); // Fecha o modal
    this.name = '';
  }
}
