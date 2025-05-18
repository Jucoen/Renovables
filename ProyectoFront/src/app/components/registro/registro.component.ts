import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

onSubmit() {
  const userData = {
    email: this.email,
    password: this.password
  };

  this.http.post('http://localhost:8050/api/users', userData).subscribe(
    (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: 'Usuario creado correctamente',
        confirmButtonText: 'OK'
      });
    },
    (error) => {
      if (error.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario ya existe',
          text: 'El email que intentas registrar ya está en uso.',
          confirmButtonText: 'OK'
        });
      } else if (error.status === 400 && error.error.message.includes('contraseña')) {
        Swal.fire({
          icon: 'warning',
          title: 'Contraseña inválida',
          text: 'La contraseña debe tener más de 5 caracteres.',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Ha ocurrido un error inesperado.',
          confirmButtonText: 'OK'
        });
      }
    }
  );
}
}