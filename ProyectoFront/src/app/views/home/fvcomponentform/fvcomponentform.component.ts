import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { LineChartComponent } from '../../../line-chart/line-chart.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fvcomponentform',
  standalone: true,
  imports: [CommonModule, FormsModule, LineChartComponent],
  templateUrl: './fvcomponentform.component.html',
  styleUrls: ['./fvcomponentform.component.css']
})
export class FVComponentFormComponent {
  latitud = 39.4487;
  longitud=  -0.4150;
  cantidad: number = 1;

  panelesDisponibles = [
    { nombre: 'Panel Alta Eficiencia 550W', potencia: 550, precio: 290, imagen: 'assets/ImagenesFV/PanelAE550w.jpg' },
    { nombre: 'Panel Monocristalino 330W', potencia: 330, precio: 190, imagen: 'assets/ImagenesFV/PanelMono330w.jpeg' },
    { nombre: 'Panel Monocristalino 450W', potencia: 450, precio: 250, imagen: 'assets/ImagenesFV/PanelMono450w.jpg' },
    { nombre: 'Panel Policristalino 400W', potencia: 400, precio: 220, imagen: 'assets/ImagenesFV/PanelPoli400W.jpg' },
  ];

  panelSeleccionadoIndex: number = 0;

  irradiacionAnual: number = 0;
  produccionAnual: number = 0;

  // Variables para gráfica y cálculos económicos
  inversionTotal: number = 0;
  ahorroAnual: number = 0;
  retornoInversion: number = 0;
  gananciasTotales: number = 0;

  // Parámetros configurables
  factorRendimientoTotal: number = 0.86;
  desgasteAnual: number = 0.05;
  vidaUtil: number = 25;
  precioElectricidad: number = 0.15;

  cargando: boolean = false;
  error: string = '';
  mostrarResultados: boolean = false;

  rawResponse: any = null;

  constructor(private dataService: DataService) {}

  seleccionarPanel(index: number) {
    this.panelSeleccionadoIndex = index;
  }

  calcularProduccion() {
    if (this.latitud == null || this.longitud == null) {
      this.error = 'Introduce latitud y longitud válidas';
      return;
    }
    if (this.cantidad < 1) {
      this.error = 'La cantidad debe ser al menos 1';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.irradiacionAnual = 0;
    this.produccionAnual = 0;
    this.rawResponse = null;

    const potenciaKw = this.panelesDisponibles[this.panelSeleccionadoIndex].potencia * this.cantidad / 1000;

    this.dataService.getPvgisData(this.latitud, this.longitud, potenciaKw).subscribe({
      next: () => {
        this.rawResponse = this.dataService.lastRaw;

        const hourly = this.rawResponse?.outputs?.hourly || [];
        const irradiacionTotalKWh = hourly.reduce((sum: number, hour: any) => {
          return sum + ((hour['G(i)'] || 0) / 1000);
        }, 0);

        this.irradiacionAnual = irradiacionTotalKWh;
        this.produccionAnual = irradiacionTotalKWh * potenciaKw * this.factorRendimientoTotal;

        this.calcularEconomia();

        this.cargando = false;
      },
      error: err => {
        console.error('Error PVGIS:', err);
        this.error = 'Error obteniendo datos PVGIS';
        this.cargando = false;
      }
    });
  }

  calcularEconomia() {
    const panel = this.panelesDisponibles[this.panelSeleccionadoIndex];

    this.inversionTotal = panel.precio * this.cantidad;
    this.ahorroAnual = this.produccionAnual * this.precioElectricidad;
    this.retornoInversion = this.ahorroAnual > 0 ? this.inversionTotal / this.ahorroAnual : 0;

    let ahorroConDesgaste = this.ahorroAnual;
    this.gananciasTotales = 0;

    for (let año = 1; año <= this.vidaUtil; año++) {
      this.gananciasTotales += ahorroConDesgaste;
      ahorroConDesgaste *= (1 - this.desgasteAnual);
    }

    this.gananciasTotales -= this.inversionTotal;
    this.mostrarResultados = true;
  }
}