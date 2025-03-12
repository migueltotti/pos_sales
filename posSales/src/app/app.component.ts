import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/navBar/nav-bar/nav-bar.component";
import { BucketCardComponent } from './components/bucketCard/bucket-card/bucket-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BucketCardComponent, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'posSales';
}
