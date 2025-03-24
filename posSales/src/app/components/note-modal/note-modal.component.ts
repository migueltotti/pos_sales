import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './note-modal.component.html',
  styleUrl: './note-modal.component.scss'
})
export class NoteModalComponent {
  @ViewChild('noteElement', { static: false }) noteElement!: ElementRef;
  private noteInstance!: Modal;

  

  @Output() orderDescription = new EventEmitter<string>()
  orderNote: string = '';
  
  setOrderDescription(){
    this.orderDescription.emit(this.orderNote);
    this.closeModal();
  }

  ngAfterViewInit() {
    this.noteInstance = new Modal(this.noteElement.nativeElement);
  }

  openModal() {
    this.noteInstance.show(); // Abre o modal
  }

  closeModal() {
    this.noteInstance.hide(); // Fecha o modal
  }
}
