import { AfterViewInit, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
}
