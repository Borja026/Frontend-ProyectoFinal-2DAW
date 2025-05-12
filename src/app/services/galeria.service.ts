import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Galeria {
  nombre: string;
  idCategoria: number;
}

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/galeria';

  constructor(private http: HttpClient) {}

  
  getGaleria(): Observable<Galeria[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        nombre: item.nombre,
        idCategoria: Number(item.idCategoria) // Convertimos a número
      })))
    );
  }
  
}
