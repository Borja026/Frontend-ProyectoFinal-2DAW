import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Categorias {
  id: number;
  categoria: string;
  nombreCarpeta: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/categorias';

  constructor(private http: HttpClient) { }

  
  getCategorias(): Observable<Categorias[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        id: Number(item.id), // Convertimos a número
        categoria: item.categoria,
        nombreCarpeta: item.nombreCarpeta
      })))
    );
  }

}
