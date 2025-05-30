import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Empleados {
  dni: string;
  nombre: string;
  apellidos: string;
  foto: string;
  fecha: Date;
  telefono: number;
  correo: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/empleados';

  constructor(private http: HttpClient) { }


  getEmpleados(): Observable<Empleados[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        dni: item.dni,
        nombre: item.nombre,
        apellidos: item.apellidos,
        foto: item.foto,
        fecha: item.fecha,
        telefono: Number(item.telefono), // Convertimos a número
        correo: item.correo,
        password: item.password,
      })))
    );
  }

}
