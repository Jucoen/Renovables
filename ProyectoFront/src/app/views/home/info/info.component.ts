import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']  // plural y array
})
export class InfoComponent {
  constructor(private router: Router) {}  // constructor fuera de métodos

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}