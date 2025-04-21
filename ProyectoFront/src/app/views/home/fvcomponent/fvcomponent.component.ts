import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { LineChartComponent } from "../../../line-chart/line-chart.component";

@Component({
  selector: 'app-fvcomponent',
  imports: [CommonModule, FormsModule, LineChartComponent],
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
      precio: 290,  // Precio real aproximado
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
  cargando: boolean = true;
  
  public getResponse(): void {
    this.service.getResponse().subscribe((response: any) => {
      this.data = response;
      this.cargando = false;
      
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

// mensaje error si no se ha seleccionado comunidad
ubicacionSeleccionadaValida: boolean = true; 
mostrarMensajeError: boolean = false;


  // calculos eléctricos panel fotovoltaico

  horasSolaresPico: number = 0;

  energiaDiariaWh: number = 0;
  energiaMensualKWh: number = 0;

  mostrarResultados: boolean = false;

  precioElectricidad: number = 0.20; // POR COMPROBAR
  Retorno: number = 0;
  inversionCalculada: number = 0;
  ahorroAnualCalculado: number = 0;
  
  gananciasTotales: number = 0; 

  desgastePorcentaje: number = 0.005;  // Desgaste anual del 0.5% (puedes ajustarlo)
  totalAhorroAnualConDesgaste: number[] = [];  // Array para almacenar el ahorro anual con desgaste

  calcularEnergia() {
    const region = this.data.find(d => d.Location === this.ubicacionSeleccionada);
    const potenciaUnit = this.panelesDisponibles[this.panelSeleccionadoIndex].potencia;
    this.potenciaPanelW = potenciaUnit * this.cantidad;

    if (this.potenciaPanelW > 0 && region) {
      this.horasSolaresPico = region.SolarIrradiance / 1000;
      this.energiaDiariaWh = this.potenciaPanelW * this.horasSolaresPico;
      this.energiaMensualKWh = (this.energiaDiariaWh * 30) / 1000;
      this.mostrarResultados = true;

      const inversion = this.panelesDisponibles[this.panelSeleccionadoIndex].precio * this.cantidad;
      const ahorroMensual = this.energiaMensualKWh * this.precioElectricidad;
      let ahorroAnual = ahorroMensual * 12;

      // Aplicar desgaste anual durante 25 años
      this.totalAhorroAnualConDesgaste = [];
      for (let year = 1; year <= 25; year++) {
        // Reducir el ahorro anual por el desgaste
        ahorroAnual = ahorroAnual * (1 - this.desgastePorcentaje);  // Aplicamos el desgaste
        this.totalAhorroAnualConDesgaste.push(ahorroAnual);  // Guardamos el ahorro anual con desgaste
      }

      // Calcular el retorno de inversión con el ahorro inicial
      this.Retorno = ahorroAnual > 0 ? inversion / ahorroAnual : 0;
      this.inversionCalculada = inversion;
      this.ahorroAnualCalculado = this.totalAhorroAnualConDesgaste[0]; // Ahorro inicial sin desgaste

      this.gananciasTotales = ahorroAnual * 25; // Ganancia total con desgaste durante 25 años
    } else {
      this.mostrarResultados = false;
    }
  }
}