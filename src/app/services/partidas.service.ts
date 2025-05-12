import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Partidas {
  id: number;
  categoria: string;
  nombreCarpeta: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartidasService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/pistasClientes'; // Cambia esto según tu URL real

  constructor(private http: HttpClient) { }

  getPartidas(): Observable<Partidas[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        id: Number(item.id), // Convertimos a número
        categoria: item.categoria,
        nombreCarpeta: item.nombreCarpeta
      })))
    );
  }

}
