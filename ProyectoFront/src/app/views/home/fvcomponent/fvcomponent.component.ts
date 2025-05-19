import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineChartComponent } from "../../../line-chart/line-chart.component";

@Component({
  selector: 'app-fvcomponent',
  imports: [CommonModule, FormsModule, LineChartComponent],
  templateUrl: './fvcomponent.component.html',
  styleUrl: './fvcomponent.component.css'
})
export class FVComponentComponent {
  @ViewChild('resultados') resultadosRef!: ElementRef;

  panelesDisponibles = [
    {
      nombre: 'Panel Alta Eficiencia 550W',
      potencia: 550,
      precio: 290,  
      imagen: 'assets/ImagenesFV/PanelAE550w.jpg'
    },
    {
      nombre: 'Panel Monocristalino 330W',
      potencia: 330,
      precio: 190,  
      imagen: 'assets/ImagenesFV/PanelMono330w.jpeg'
    },
    {
      nombre: 'Panel Monocristalino 450W',
      potencia: 450,
      precio: 250,  
      imagen: 'assets/ImagenesFV/PanelMono450w.jpg'
    },
    {
      nombre: 'Panel Policristalino 400W',
      potencia: 400,
      precio: 220,  
      imagen: 'assets/ImagenesFV/PanelPoli400W.jpg'
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
  constructor(public service: DataService) {}
  cargando: boolean = true;

  public getResponse(): void {
    this.service.getResponse().subscribe((response: any) => {
      this.data = response;
      this.cargando = false;
    });
  }

  public ngOnInit(): void {
    this.getResponse();
  }

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

  ubicacionSeleccionadaValida: boolean = true; 
  mostrarMensajeError: boolean = false;

  horasSolaresPico: number = 0;
  energiaDiariaWh: number = 0;
  energiaMensualKWh: number = 0;
  mostrarResultados: boolean = false;

  precioElectricidad: number = 0.20;
  Retorno: number = 0;
  inversionCalculada: number = 0;
  ahorroAnualCalculado: number = 0;
  gananciasTotales: number = 0; 

  desgastePorcentaje: number = 0.005;
  totalAhorroAnualConDesgaste: number[] = [];

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

      this.totalAhorroAnualConDesgaste = [];
      for (let year = 1; year <= 25; year++) {
        ahorroAnual *= (1 - this.desgastePorcentaje);
        this.totalAhorroAnualConDesgaste.push(ahorroAnual);
      }

      this.Retorno = ahorroAnual > 0 ? inversion / this.totalAhorroAnualConDesgaste[0] : 0;
      this.inversionCalculada = inversion;
      this.ahorroAnualCalculado = this.totalAhorroAnualConDesgaste[0];
      this.gananciasTotales = this.totalAhorroAnualConDesgaste.reduce((acc, ahorro) => acc + ahorro, 0);

      // Scroll automático al resultado
      setTimeout(() => {
        if (this.resultadosRef) {
          this.resultadosRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      this.mostrarResultados = false;
    }
  }
}