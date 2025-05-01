import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userEmail: string | null = null;
  isAuthenticated: boolean = false;  // Nueva propiedad para saber si está logueado

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserEmail();
  }

  loadUserEmail(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userEmail = decoded.email || decoded.username || 'no definido';
        this.isAuthenticated = true;  // El usuario está autenticado
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.isAuthenticated = false;  // Si ocurre un error, el usuario no está autenticado
      }
    } else {
      this.isAuthenticated = false;  // Si no hay token, no está autenticado
    }
  }

  logout(): void {
    // Elimina el token del localStorage
    localStorage.removeItem('token');
    // Limpia la variable userEmail y actualiza la autenticación
    this.userEmail = null;
    this.isAuthenticated = false;  // El usuario ha cerrado sesión
    // Redirige al login
    this.router.navigate(['/login']);
  }
}