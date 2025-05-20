import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


// export interface Clientes {
//   correo: string;
//   nombre: string;
//   apellidos: string;
//   fecha: Date;
//   foto: string;
//   telefono: number;
//   username: string;
//   password: string;
//   sexo: null;
//   nivel: number;
//   posicion: string;
//   recibeClases: null;
// }
export interface Clientes {
  correo: string;
  nombre: string;
  apellidos: string;
  fecha: Date;
  foto: string;
  telefono: number;
  username: string;
  password: string;
  sexo: boolean | null;
  nivel: number;
  posicion: string;
  recibeClases: boolean | null;
}


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/clientes';
  // private apiUrl = '../../../../../api_backend/public/clientes';

  constructor(private http: HttpClient) { }


  getClientes(): Observable<Clientes[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => ({
        correo: item.correo,
        nombre: item.nombre,
        apellidos: item.apellidos,
        // fecha: item.fecha,
        fecha: new Date(item.fecha), // Convertimos a Date
        foto: item.foto,
        telefono: Number(item.telefono), // Convertimos a número
        username: item.username,
        password: item.password,
        sexo: null, // Convertimos a número
        nivel: Number(item.nivel), // Convertimos a número
        posicion: item.posicion,
        recibeClases: null // Convertimos a número
      })))
    );
  }

  actualizarCliente(cliente: Clientes): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${encodeURIComponent(cliente.correo)}`,
      cliente
    );
  }

  registrarCliente(cliente: Clientes): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

}
