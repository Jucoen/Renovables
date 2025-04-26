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
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            pointRadius: 0, /* Sin puntitos grandes */
            tension: 0.3
          },
          {
            label: 'Inversión inicial (€)',
            data: years.map(() => this.inversionTotal),
            borderDash: [5, 5],
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, /* Mejor en móviles */
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '€',
              font: {
                size: 14
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Años',
              font: {
                size: 14
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Rentabilidad a lo largo de los años',
            font: {
              size: 18
            }
          },
          legend: {
            labels: {
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }
}