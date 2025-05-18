import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userEmail: string | null = null;
  isAuthenticated = false;

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
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.isAuthenticated = false;
      }
    } else {
      this.isAuthenticated = false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userEmail = null;
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  // Función para chequear acceso y mostrar alerta si no está autenticado
  checkAccess(route: string): void {
    if (!this.isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión para acceder a esta sección',
        confirmButtonText: 'Ir a iniciar sesión'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate([route]);
    }
  }
navigateProtected(route: string, event: Event): void {
  event.preventDefault();  // Para que no navegue automáticamente

  if (this.isAuthenticated) {
    this.router.navigate([route]);
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Debes iniciar sesión',
      text: 'Para acceder a esta sección, por favor inicia sesión.',
      confirmButtonText: 'Aceptar'
    });
  }
}
}