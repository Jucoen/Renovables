import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-fvcomponent',
  imports: [CommonModule, FormsModule],
  templateUrl: './fvcomponent.component.html',
  styleUrl: './fvcomponent.component.css'
})
export class FVComponentComponent {

  panelesDisponibles = [
    {
      nombre: 'Panel Monocristalino 330W',
      potencia: 330,
      precio: 190,  
      imagen: 'https://www.wccsolar.net/wp-content/uploads/nc/media/c805a9_8a961ada518c42a3b16471a936a2e9bemv2.jpg/v1/fit/w_1000h_1000q_90/file.jpg'
    },
    {
      nombre: 'Panel Policristalino 400W',
      potencia: 400,
      precio: 220, 
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrmec8obZkY_zHLvzG24-H0kZXsgocITN5ug&s'
    },
    {
      nombre: 'Panel Monocristalino 450W',
      potencia: 450,
      precio: 250,  
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6v2rB25mq3t7Oi8oTeLWGjqR1FszY0JtQBw&s'
    },
    {
      nombre: 'Panel Alta Eficiencia 550W',
      potencia: 550,
      precio: 290,
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPT4r0HqHkiDEgGFNLl-J5gooPXuxZpYSicw&s'
    },
  ];
  panelSeleccionadoIndex: number = 0; 
  potenciaPanelW: number = 330; 
  seleccionarPanel(index: number) {
    this.panelSeleccionadoIndex = index;
    this.potenciaPanelW = this.panelesDisponibles[index].potencia;
  }

public data: any[] = [];
HPS: any;
ubicacionSeleccionada: string = '';
  
  constructor(public service: DataService){}

  public getResponse(): void {
    this.service.getResponse().subscribe((response: any) => {
      this.data = response;
      console.log(this.data);
    })
  }

  public ngOnInit():void{
    this.getResponse();
  }


// preparativos precalculo

cantidad: number = 1;

panelSeleccionado = {
  nombre: 'Panel Monocristalino 330W',
  potencia: 330,
  precio: 2800,
  img: 'data:image/jpeg;base64,/=='
};

continuar() {
  this.potenciaPanelW = this.panelSeleccionado.potencia;
  this.mostrarResultados = false;

}

  // calculos eléctricos panel fotovoltaico

  horasSolaresPico: number = 0;

  energiaDiariaWh: number = 0;
  energiaMensualKWh: number = 0;

  mostrarResultados: boolean = false;

  precioElectricidad: number = 0.20; // POR COMPROBAR
  Retorno: number = 0;

  calcularEnergia() {
    const region = this.data.find(d => d.Location === this.ubicacionSeleccionada);
    const potenciaUnit = this.panelesDisponibles[this.panelSeleccionadoIndex].potencia;
    this.potenciaPanelW = potenciaUnit * this.cantidad;
  
    if (this.potenciaPanelW > 0 && region) {
      this.horasSolaresPico = region.SolarIrradiance / 365;
      this.energiaDiariaWh = this.potenciaPanelW * this.horasSolaresPico;
      this.energiaMensualKWh = (this.energiaDiariaWh * 30)/1000;
      this.mostrarResultados = true;
  
      // Cálculo de retorno de inversión
      const inversion = this.panelesDisponibles[this.panelSeleccionadoIndex].precio * this.cantidad;
      const ahorroMensual = this.energiaMensualKWh * this.precioElectricidad;
      this.Retorno = ahorroMensual > 0 ? inversion / (ahorroMensual * 12) : 0;
    } else {
      this.mostrarResultados = false;
    }
  }
}