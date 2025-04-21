import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() inversionTotal: number = 0;
  @Input() ahorroAnual: number = 0;
  @Input() desgastePorcentaje: number = 0.05; // Aumentamos el desgaste a 5% por año para que se vea claramente

  public chart: Chart;

  ngOnInit(): void {
    this.dibujarGrafico();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inversionTotal'] || changes['ahorroAnual'] || changes['desgastePorcentaje']) {
      this.dibujarGrafico();
    }
  }

  dibujarGrafico() {
    if (this.chart) {
      this.chart.destroy();
    }

    const years: number[] = [];
    const rentabilidad: number[] = [];

    let acumulado = 0;
    let ahorroAnualConDesgaste = this.ahorroAnual;


    for (let i = 1; i <= 25; i++) {
      acumulado += ahorroAnualConDesgaste;
      years.push(i);
      rentabilidad.push(acumulado);

      ahorroAnualConDesgaste = ahorroAnualConDesgaste * (1 - this.desgastePorcentaje);
    }

    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: years.map(y => `Año ${y}`),
        datasets: [
          {
            label: 'Ahorro acumulado (€)',
            data: rentabilidad,
            fill: false,
            borderColor: 'rgb(75,192,192)',
            tension: 0.1
          },
          {
            label: 'Inversión inicial (€)',
            data: years.map(() => this.inversionTotal),
            borderDash: [5, 5],
            borderColor: 'rgb(255,99,132)',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '€'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Años'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Rentabilidad acumulada vs Inversión (con desgaste)'
          }
        }
      }
    });
  }
}