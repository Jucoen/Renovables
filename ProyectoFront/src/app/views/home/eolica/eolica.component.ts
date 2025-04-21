import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineChartComponent } from "../../../line-chart/line-chart.component";

@Component({
  selector: 'app-eolica',
  standalone: true,
  imports: [CommonModule, FormsModule, LineChartComponent],
  templateUrl: './eolica.component.html',
  styleUrl: './eolica.component.css'
})
export class EolicaComponent {
  velocidadViento: number = 0;

  turbinasDisponibles = [
    { 
      nombre: 'Mini-Turbina Eólica Modelo A 0.4 KW', 
      precio: 1500, 
      potencia: 0.4, 
      imagen: 'https://grupo3e.net/wp-content/uploads/2023/03/IMG_20221222_130102-scaled.jpg' 
    },
    { 
      nombre: 'Mini-Turbina Eólica Modelo B 1kw', 
      precio: 2500, 
      potencia: 1.0, 
      imagen: 'https://www.bbva.com/wp-content/uploads/2019/10/minieolica.jpg' 
    },
    { 
      nombre: 'Mini-Turbina Eólica Modelo C 3kw', 
      precio: 5000, 
      potencia: 3.0, 
      imagen: 'https://www.kozoarquitectura.es/wp-content/uploads/2019/10/energia-mineolica.jpg' 
    }
  ];

  turbinaSeleccionadoIndex: number = 0;
  potenciTurbinaKW: number = 0.4;
  cantidad: number = 1;
  turbinaSeleccionada = this.turbinasDisponibles[0];

  ubicacionSeleccionada: string = '';
  data: any[] = [];
  cargando: boolean = true;

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
  potenciaTotalKW: number = 0;

  constructor(public service: DataService) {}

  ngOnInit(): void {
    this.getResponse();
  }

  getResponse(): void {
    this.service.getResponse().subscribe((response: any) => {
      this.data = response;
      this.cargando = false;
    });
  }

  seleccionarTurbina(index: number): void {
    this.turbinaSeleccionadoIndex = index;
    this.potenciTurbinaKW = this.turbinasDisponibles[index].potencia;
  }

  calcularEnergia(): void {
    const region = this.data.find(d => d.Location === this.ubicacionSeleccionada);
    if (!region) {
      console.error('No se encontró la ubicación seleccionada.');
      return;
    }

    const potenciaUnit = this.turbinasDisponibles[this.turbinaSeleccionadoIndex].potencia;
    this.potenciTurbinaKW = potenciaUnit * this.cantidad;

    this.velocidadViento = region.WindSpeed;
    const turbina = this.turbinasDisponibles[this.turbinaSeleccionadoIndex];
    const potenciaTurbinaKW = turbina.potencia;
    const eficiencia = 0.3;
    const velocidadNominal = 10; // 10 m/s como base
    const horasEquivalentesDia = eficiencia * Math.pow(this.velocidadViento / velocidadNominal, 3) * 24;

    this.potenciaTotalKW = potenciaTurbinaKW * this.cantidad;
    const energiaDiariaKW = this.potenciaTotalKW * horasEquivalentesDia;
    this.energiaDiariaWh = energiaDiariaKW * 1000;
    this.energiaMensualKWh = energiaDiariaKW * 30;

    this.mostrarResultados = true;

    const inversion = turbina.precio * this.cantidad;
    const ahorroMensual = this.energiaMensualKWh * this.precioElectricidad;
    let ahorroAnual = ahorroMensual * 12;

    this.totalAhorroAnualConDesgaste = [];
    for (let year = 1; year <= 25; year++) {
      ahorroAnual *= (1 - this.desgastePorcentaje);
      this.totalAhorroAnualConDesgaste.push(ahorroAnual);
    }

    this.Retorno = ahorroAnual > 0 ? inversion / ahorroAnual : 0;
    this.inversionCalculada = inversion;
    this.ahorroAnualCalculado = this.totalAhorroAnualConDesgaste[0];
    this.gananciasTotales = this.totalAhorroAnualConDesgaste.reduce((a, b) => a + b, 0);

    // Consolas para depuración
    console.log('Velocidad del viento:', this.velocidadViento);
    console.log('Potencia total KW:', this.potenciaTotalKW);
    console.log('Horas equivalentes por día:', horasEquivalentesDia);
    console.log('Energía diaria estimada (Wh):', this.energiaDiariaWh);
    console.log('Energía mensual estimada (kWh):', this.energiaMensualKWh);
    console.log('Inversión:', inversion);
    console.log('Ahorro anual:', ahorroAnual);
    console.log('Retorno de inversión:', this.Retorno);
  }
}