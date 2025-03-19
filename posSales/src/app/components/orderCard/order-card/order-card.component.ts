import { Component, Input } from '@angular/core';
import { OrderOutput } from '../../../../entities/orderOutput';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {
  @Input() order!: OrderOutput;
  @Input() orderId = 0;

  getProdName(name: string) : string{
    const nameWidth = this.getTextWidth(name);
    //const amountWidth = this.getTextWidth(amount);
    
    //const availableWidth = maxWidth - (nameWidth + amountWidth);
    const availableWidth = 200 - nameWidth;
    const dotWidth = this.getTextWidth(".");
    
    const dotCount = Math.floor(availableWidth / dotWidth);
    return name + ".".repeat(dotCount > 0 ? dotCount : 1);
  }

  getTextWidth(text: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context!.font = "16px Arial"
    return context!.measureText(text).width;
  }
}
