// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// export interface Partidas {
//   id: number;
//   fechaHora: string;
//   correoClientes: string;
//   idPistas: number;
//   numPersonas: number;
//   nivelPersonas: string;
//   mediaNivel: number;
//   estadoPago: string;
//   cancelada: string;
//   pago_id: string | null;
//   fechaCancelacion: string | null;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PartidasService {
//   private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public';

//   constructor(private http: HttpClient) { }

//   getPartidas(): Observable<Partidas[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/pistasClientes`).pipe(
//       map(partidas =>
//         partidas.map(p => ({
//           ...p,
//           numPersonas: parseInt(p.numPersonas || '0', 10),
//           idPistas: parseInt(p.idPistas || '0', 10),
//           mediaNivel: parseFloat(p.mediaNivel || '0'),
//           estadoPago: p.estadoPago || '',
//           cancelada: p.cancelada || '0',
//           pago_id: p.pago_id || null,
//           fechaCancelacion: p.fechaCancelacion || null
//         }))
//       )
//     );
//   }

//   getReservasPorFecha(fecha: string): Observable<Partidas[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/pistasClientesFecha?fecha=${fecha}`).pipe(
//       map(partidas =>
//         partidas.map(p => ({
//           ...p,
//           numPersonas: parseInt(p.numPersonas || '0', 10),
//           idPistas: parseInt(p.idPistas || '0', 10),
//           mediaNivel: parseFloat(p.mediaNivel || '0'),
//           estadoPago: p.estadoPago || '',
//           cancelada: p.cancelada || '0',
//           pago_id: p.pago_id || null,
//           fechaCancelacion: p.fechaCancelacion || null
//         }))
//       )
//     );
//   }

//   getClientePorCorreo(correo: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/clientes/correo/${correo}`);
//   }

//   getJugadoresPorPista(fechaHora: string, idPista: number): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/jugadoresPorPista?fechaHora=${fechaHora}&idPista=${idPista}`);
//   }

//   pagarYReservar(reserva: Partidas): Observable<any> {
//     return this.http.post(`${this.apiUrl}/pagarYReservar`, reserva);
//   }

//   cancelarReserva(data: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/cancelarReserva`, data);
//   }

//   crearReserva(reserva: Partidas): Observable<any> {
//     return this.http.post(`${this.apiUrl}/pistasClientes`, reserva);
//   }
// }








import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Partidas {
  id: number;
  fechaHora: string;
  correoClientes: string;
  idPistas: number;
  numPersonas: number;
  nivelPersonas: string;
  mediaNivel: number;
  estadoPago: string;
  cancelada: string;
  pago_id: string | null;
  fechaCancelacion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PartidasService {
  private apiUrl = 'https://borja.com.es/ProyectoDosDAW/api_backend/public';

  constructor(private http: HttpClient) { }

  getPartidas(): Observable<Partidas[]> {
    return this.http.get<Partidas[]>(`${this.apiUrl}/pistasClientes`);
  }

  getReservasPorFecha(fecha: string): Observable<Partidas[]> {
    return this.http.get<Partidas[]>(`${this.apiUrl}/pistasClientesFecha?fecha=${fecha}`);
  }

  getClientePorCorreo(correo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/correo/${correo}`);
  }

  getJugadoresPorPista(fechaHora: string, idPista: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jugadoresPorPista?fechaHora=${fechaHora}&idPista=${idPista}`);
  }

  pagarYReservar(reserva: Omit<Partidas, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/pagarYReservar`, reserva);
  }

  cancelarReserva(data: {
    fechaHora: string;
    idPistas: number;
    correoClientes: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancelarReserva`, data);
  }

  crearReserva(reserva: Omit<Partidas, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/pistasClientes`, reserva);
  }

  actualizarReserva(id: number, reserva: Partidas): Observable<any> {
    return this.http.put(`${this.apiUrl}/pistasClientes/${id}`, reserva);
  }
}
