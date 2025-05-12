import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Clientes {
  correo: string;
  nombre: string;
  apellidos: string;
  fecha: string;
  foto: string;
  telefono: number;
  username: string;
  password: string;
  sexo: number;
  nivel: boolean;
  posicion: string;
  recibeClases: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/clientes';

  constructor(private http: HttpClient) {}

  
  getClientes(): Observable<Clientes[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        correo: item.correo,
        nombre: item.nombre,
        apellidos: item.apellidos,
        fecha: item.fecha,
        foto: item.foto,
        telefono: Number(item.telefono), // Convertimos a número
        username: item.username,
        password: item.password,
        sexo: Number(item.sexo), // Convertimos a número
        nivel: Boolean(item.nivel), // Convertimos a número
        posicion: item.posicion,
        recibeClases: Number(item.recibeClases) // Convertimos a número
      })))
    );
  }
  
}
