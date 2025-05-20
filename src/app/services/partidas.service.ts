import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Partidas {
  fechaHora: Date;
  correoClientes: string;
  idPistas: number;
  numPersonas: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartidasService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/pistasClientes';

  constructor(private http: HttpClient) { }

  
  getPartidas(): Observable<Partidas[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        fechaHora: item.fechaHora,
        correoClientes: item.correoClientes,
        idPistas: Number(item.idPistas), // Convertimos a número
        numPersonas: Number(item.numPersonas) // Convertimos a número
      })))
    );
  }

}
