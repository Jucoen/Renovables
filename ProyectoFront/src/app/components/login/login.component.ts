import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';``
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8050/api/login_check', loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token); // Guarda JWT
          Swal.fire({
            icon: 'success',
            title: 'Login correcto',
            text: '¡Has iniciado sesión correctamente!',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/home']); // Redirige tras cerrar alerta
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'Email o contraseña incorrectos. Intenta de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }
}