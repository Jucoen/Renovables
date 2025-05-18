import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  public lastRaw: any = null;  // <-- Añadido para guardar la última respuesta

  constructor(private http: HttpClient) { }

  public getResponse(): Observable<any> {
    return this.http.get<any>('http://localhost:8050/api/datos');
  }

  public getPvgisData(
    lat: number,
    lon: number,
    peakPowerKw: number
  ): Observable<{ irradiacionAnual: number; produccionAnual: number; }> {
    const url = `/api/seriescalc`
      + `?lat=${lat}`
      + `&lon=${lon}`
      + `&startyear=2020`
      + `&endyear=2020`
      + `&usehorizon=1`
      + `&pvtechchoice=crystSi`
      + `&peakpower=${peakPowerKw}`
      + `&loss=14`
      + `&optimalangles=1`
      + `&outputformat=json`;

    return this.http.get<any>(url).pipe(
      tap(raw => {
        this.lastRaw = raw;  // Guardamos la respuesta entera para debug o uso posterior
        console.debug('[PVGIS hourly sample]', raw.outputs.hourly[0]);
      }),
      map(response => {
        const hourly: any[] = response.outputs?.hourly || [];
        const irradiacionAnual = hourly.reduce(
          (sum, h) => sum + (h['G(i)'] || 0), 0
        );
        const produccionAnual = hourly.reduce(
          (sum, h) => sum + (h['E'] || 0), 0
        );
        return { irradiacionAnual, produccionAnual };
      })
    );
  }
}