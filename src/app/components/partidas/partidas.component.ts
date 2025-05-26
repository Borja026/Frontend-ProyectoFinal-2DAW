// import { Component, OnInit } from '@angular/core';
// import { PartidasService, Partidas } from '../../services/partidas.service';
// import { EmailService } from '../../services/email.service';
// import { Router } from '@angular/router';

// interface PistaReservada {
//   idPista: number;
//   hora: string;
//   apuntados: number;
//   imagePista: string;
//   jugadores: any[];
// }

// @Component({
//   selector: 'app-partidas',
//   templateUrl: './partidas.component.html',
//   styleUrls: ['./partidas.component.css']
// })
// export class PartidasComponent implements OnInit {
//   activePista: number | null = null;
//   activeIndex: number | null = null;
//   showButtons: boolean = false;
//   showFriendLevels: boolean = false;
//   friendLevels: string[] = [];
//   reservarPista: boolean = false;
//   numberFriends: number = 1;
//   fechaSeleccionada: string = '';

//   nivelCliente: number = 0;
//   posicionCliente: string = 'Indiferente';
//   correoCliente: string = '';

//   pistas: PistaReservada[] = [];

//   // constructor(private partidasService: PartidasService ) { }
//   constructor(
//     private partidasService: PartidasService,
//     private emailService: EmailService,
//     private router: Router
//   ) { }


//   ngOnInit(): void {
//     const correo = localStorage.getItem('usuarioCorreo');
//     const nivel = localStorage.getItem('usuarioNivel');
//     const posicion = localStorage.getItem('usuarioPosicion');

//     if (correo) {
//       this.correoCliente = correo;
//       this.nivelCliente = nivel ? parseFloat(nivel) : 0;
//       this.posicionCliente = posicion || 'Indiferente';
//     }

//     const hoy = new Date();
//     hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
//     const fechaLocal = hoy.toISOString().split('T')[0];

//     this.fechaSeleccionada = fechaLocal;
//     this.cargarReservasPorFecha(fechaLocal);
//   }

//   cargarReservasPorFecha(fecha: string) {
//     this.fechaSeleccionada = fecha;
//     this.partidasService.getReservasPorFecha(fecha).subscribe((reservas: Partidas[]) => {
//       console.log('Todas las reservas recibidas:', reservas); // <-- Para depuración
//       const horas = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:30'];
//       const pistasIDs = [1, 2, 3];
//       const nuevasPistas: PistaReservada[] = [];
//       let pendingRequests = 0;

//       pistasIDs.forEach(id => {
//         horas.forEach(hora => {
//           const reservasDeEsta = reservas.filter(r => {
//             const fechaObj = new Date(r.fechaHora);
//             const h = fechaObj.getHours().toString().padStart(2, '0');
//             const m = fechaObj.getMinutes().toString().padStart(2, '0');
//             const rHora = `${h}:${m}`;
//             return (
//               r.idPistas === id &&
//               rHora === hora &&
//               r.cancelada !== '1' &&
//               r.estadoPago === 'pagado'
//             );
//           });

//           console.log('Reservas para pista', id, 'a las', hora, reservasDeEsta);
//           const apuntados = reservasDeEsta.reduce((total, r) => total + Number(r.numPersonas || 0), 0);
//           console.log(`Apuntados en pista ${id} a las ${hora}: ${apuntados}`);

//           const pistaData: PistaReservada = {
//             idPista: id,
//             hora: hora,
//             apuntados: apuntados,
//             imagePista: this.obtenerImagenPista(apuntados),
//             jugadores: []
//           };

//           pendingRequests++;
//           this.partidasService.getJugadoresPorPista(`${fecha} ${hora}:00`, id).subscribe(jugadores => {
//             pistaData.jugadores = jugadores;
//             nuevasPistas.push(pistaData);
//             pendingRequests--;

//             if (pendingRequests === 0) {
//               this.pistas = nuevasPistas.sort((a, b) => a.idPista - b.idPista || a.hora.localeCompare(b.hora));
//             }
//           });
//         });
//       });
//     });
//   }

//   obtenerImagenPista(apuntados: number): string {
//     if (apuntados === 0) return 'pista_verde.png';
//     if (apuntados >= 1 && apuntados <= 3) return 'pista_naranja.png';
//     if (apuntados === 4) return 'pista_roja.png';
//     return 'pista_azul.png';
//   }

//   onImageClick(event: MouseEvent, index: number) {
//     const target = event.currentTarget as HTMLElement;
//     const idPista = target.getAttribute('data-id');
//     const hora = target.getAttribute('data-hora');

//     if (idPista && hora) {
//       this.activeIndex = index;
//       this.activePista = +idPista;
//       this.showButtons = true;
//       this.showFriendLevels = false;
//     }
//   }

//   apuntarseSolo() {
//     if (!this.correoCliente) {
//       alert('Debes iniciar sesión para reservar una pista.');
//       return;
//     }

//     const pista = this.pistas[this.activeIndex!];
//     const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

//     if (pista.apuntados >= 4) {
//       alert('Esta pista ya está completa.');
//       return;
//     }

//     const reserva = {
//       fechaHora,
//       correoClientes: this.correoCliente,
//       idPistas: pista.idPista,
//       numPersonas: 1,
//       nivelPersonas: JSON.stringify([this.nivelCliente]),
//       mediaNivel: this.nivelCliente,
//       estadoPago: 'pendiente',
//       cancelada: '0',
//       pago_id: null,
//       fechaCancelacion: null
//     };

//     this.partidasService.pagarYReservar(reserva).subscribe({
//       next: (res) => {
//         window.location.href = res.url;
//       },
//       error: err => alert(err.error?.message || 'Error al iniciar el pago.')
//     });

//     this.showButtons = false;
//   }

//   apuntarseConAmigos(cantidad: number) {
//     this.friendLevels = new Array(cantidad).fill('');
//     this.showFriendLevels = true;
//     this.numberFriends = cantidad;
//   }

//   guardarNivelesAmigos(index: number) {
//     if (!this.correoCliente) {
//       alert('Debes iniciar sesión para reservar una pista.');
//       return;
//     }

//     const pista = this.pistas[index];
//     const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

//     const nivelesAmigos = this.friendLevels.map(n => parseFloat(n));
//     const todosLosNiveles = [this.nivelCliente, ...nivelesAmigos];

//     if (pista.apuntados + todosLosNiveles.length > 4) {
//       alert('No hay suficiente espacio para todos en esta pista.');
//       return;
//     }

//     const media = this.calcularMedia(todosLosNiveles);

//     const reserva = {
//       fechaHora,
//       correoClientes: this.correoCliente,
//       idPistas: pista.idPista,
//       numPersonas: todosLosNiveles.length,
//       nivelPersonas: JSON.stringify(todosLosNiveles),
//       mediaNivel: parseFloat(media.toFixed(2)),
//       estadoPago: 'pendiente',
//       cancelada: '0',
//       pago_id: null,
//       fechaCancelacion: null
//     };

//     this.partidasService.pagarYReservar(reserva).subscribe({
//       next: (res) => {
//         window.location.href = res.url;
//       },
//       error: err => alert(err.error?.message || 'Error al iniciar el pago.')
//     });

//     this.showFriendLevels = false;
//     this.showButtons = false;
//   }

//   calcularMedia(numeros: number[]): number {
//     const suma = numeros.reduce((acc, n) => acc + n, 0);
//     return suma / numeros.length;
//   }

//   parseNiveles(nivelPersonas: string): number[] {
//     try {
//       return JSON.parse(nivelPersonas);
//     } catch {
//       return [];
//     }
//   }

//   // cancelarReserva(pista: PistaReservada) {
//   //   const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

//   //   if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;

//   //   this.partidasService.cancelarReserva({
//   //     fechaHora,
//   //     idPistas: pista.idPista
//   //   }).subscribe({
//   //     next: () => {
//   //       alert('Reserva cancelada correctamente.');
//   //       this.cargarReservasPorFecha(this.fechaSeleccionada);
//   //     },
//   //     error: err => alert(err.error?.message || 'Error al cancelar la reserva.')
//   //   });
//   // }
//   cancelarReserva(pista: PistaReservada) {
//     const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

//     if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;

//     this.partidasService.cancelarReserva({
//       fechaHora,
//       idPistas: pista.idPista,
//       correoClientes: this.correoCliente
//     }).subscribe({
//       next: () => {
//         alert('Reserva cancelada correctamente.');
//         this.emailService.enviarCorreoCancelacion(this.correoCliente, pista.idPista, fechaHora);

//         // Redirigir a 'Partidas' después de 2 segundos
//         setTimeout(() => {
//           this.router.navigate(['/partidas']);
//         }, 2000);
//       },
//       error: err => alert(err.error?.message || 'Error al cancelar la reserva.')
//     });
//   }


//   clienteTieneReserva(pista: any): boolean {
//     return pista.jugadores?.some((j: any) => j.correoClientes === this.correoCliente);
//   }
// }




import { Component, OnInit } from '@angular/core';
import { PartidasService, Partidas } from '../../services/partidas.service';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';

interface PistaReservada {
  idPista: number;
  hora: string;
  apuntados: number;
  imagePista: string;
  jugadores: any[];
}

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.css']
})
export class PartidasComponent implements OnInit {
  activePista: number | null = null;
  activeIndex: number | null = null;
  showButtons: boolean = false;
  showFriendLevels: boolean = false;
  friendLevels: string[] = [];
  reservarPista: boolean = false;
  numberFriends: number = 1;
  fechaSeleccionada: string = '';

  nivelCliente: number = 0;
  posicionCliente: string = 'Indiferente';
  correoCliente: string = '';

  pistas: PistaReservada[] = [];

  constructor(
    private partidasService: PartidasService,
    private emailService: EmailService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const correo = localStorage.getItem('usuarioCorreo');
    const nivel = localStorage.getItem('usuarioNivel');
    const posicion = localStorage.getItem('usuarioPosicion');

    if (correo) {
      this.correoCliente = correo;
      this.nivelCliente = nivel ? parseFloat(nivel) : 0;
      this.posicionCliente = posicion || 'Indiferente';
    }

    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    const fechaLocal = hoy.toISOString().split('T')[0];

    this.fechaSeleccionada = fechaLocal;
    this.cargarReservasPorFecha(fechaLocal);
  }

  cargarReservasPorFecha(fecha: string) {
    this.fechaSeleccionada = fecha;
    this.partidasService.getReservasPorFecha(fecha).subscribe((reservas: Partidas[]) => {
      const horas = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:30'];
      const pistasIDs = [1, 2, 3];
      const nuevasPistas: PistaReservada[] = [];
      let pendingRequests = 0;

      pistasIDs.forEach(id => {
        horas.forEach(hora => {
          const reservasDeEsta = reservas.filter(r => {
            const fechaObj = new Date(r.fechaHora);
            const h = fechaObj.getHours().toString().padStart(2, '0');
            const m = fechaObj.getMinutes().toString().padStart(2, '0');
            const rHora = `${h}:${m}`;
            return (
              r.idPistas === id &&
              rHora === hora &&
              r.cancelada !== '1' &&
              r.estadoPago === 'pagado'
            );
          });

          const apuntados = reservasDeEsta.reduce((total, r) => total + Number(r.numPersonas || 0), 0);

          const pistaData: PistaReservada = {
            idPista: id,
            hora: hora,
            apuntados: apuntados,
            imagePista: this.obtenerImagenPista(apuntados),
            jugadores: []
          };

          pendingRequests++;
          this.partidasService.getJugadoresPorPista(`${fecha} ${hora}:00`, id).subscribe(jugadores => {
            pistaData.jugadores = jugadores;
            nuevasPistas.push(pistaData);
            pendingRequests--;

            if (pendingRequests === 0) {
              this.pistas = nuevasPistas.sort((a, b) => a.idPista - b.idPista || a.hora.localeCompare(b.hora));
            }
          });
        });
      });
    });
  }

  obtenerImagenPista(apuntados: number): string {
    if (apuntados === 0) return 'pista_verde.png';
    if (apuntados >= 1 && apuntados <= 3) return 'pista_naranja.png';
    if (apuntados === 4) return 'pista_roja.png';
    return 'pista_azul.png';
  }

  onImageClick(event: MouseEvent, index: number) {
    const target = event.currentTarget as HTMLElement;
    const idPista = target.getAttribute('data-id');
    const hora = target.getAttribute('data-hora');

    if (idPista && hora) {
      this.activeIndex = index;
      this.activePista = +idPista;
      this.showButtons = true;
      this.showFriendLevels = false;
    }
  }

  apuntarseSolo() {
    if (!this.correoCliente) {
      alert('Debes iniciar sesión para reservar una pista.');
      return;
    }

    const pista = this.pistas[this.activeIndex!];
    const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

    if (pista.apuntados >= 4) {
      alert('Esta pista ya está completa.');
      return;
    }

    const reserva = {
      fechaHora,
      correoClientes: this.correoCliente,
      idPistas: pista.idPista,
      numPersonas: 1,
      nivelPersonas: JSON.stringify([this.nivelCliente]),
      mediaNivel: this.nivelCliente,
      estadoPago: 'pendiente',
      cancelada: '0',
      pago_id: null,
      fechaCancelacion: null
    };

    this.partidasService.pagarYReservar(reserva).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: err => alert(err.error?.message || 'Error al iniciar el pago.')
    });

    this.showButtons = false;
  }

  apuntarseConAmigos(cantidad: number) {
    this.friendLevels = new Array(cantidad).fill('');
    this.showFriendLevels = true;
    this.numberFriends = cantidad;
  }

  guardarNivelesAmigos(index: number) {
    if (!this.correoCliente) {
      alert('Debes iniciar sesión para reservar una pista.');
      return;
    }

    const pista = this.pistas[index];
    const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

    const nivelesAmigos = this.friendLevels.map(n => parseFloat(n));
    const todosLosNiveles = [this.nivelCliente, ...nivelesAmigos];

    if (pista.apuntados + todosLosNiveles.length > 4) {
      alert('No hay suficiente espacio para todos en esta pista.');
      return;
    }

    const media = this.calcularMedia(todosLosNiveles);

    const reserva = {
      fechaHora,
      correoClientes: this.correoCliente,
      idPistas: pista.idPista,
      numPersonas: todosLosNiveles.length,
      nivelPersonas: JSON.stringify(todosLosNiveles),
      mediaNivel: parseFloat(media.toFixed(2)),
      estadoPago: 'pendiente',
      cancelada: '0',
      pago_id: null,
      fechaCancelacion: null
    };

    this.partidasService.pagarYReservar(reserva).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: err => alert(err.error?.message || 'Error al iniciar el pago.')
    });

    this.showFriendLevels = false;
    this.showButtons = false;
  }

  cancelarReserva(pista: PistaReservada) {
    const fechaHora = `${this.fechaSeleccionada} ${pista.hora}:00`;

    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;

    this.partidasService.cancelarReserva({
      fechaHora,
      idPistas: pista.idPista,
      correoClientes: this.correoCliente
    }).subscribe({
      next: () => {
        alert('Reserva cancelada correctamente.');
        this.emailService.enviarCorreoCancelacion(this.correoCliente, pista.idPista, fechaHora);

        setTimeout(() => {
          this.router.navigate(['/partidas']);
        }, 2000);
      },
      error: err => alert(err.error?.message || 'Error al cancelar la reserva.')
    });
  }

  clienteTieneReserva(pista: any): boolean {
    return pista.jugadores?.some((j: any) => j.correoClientes === this.correoCliente);
  }

  calcularMedia(numeros: number[]): number {
    const suma = numeros.reduce((acc, n) => acc + n, 0);
    return suma / numeros.length;
  }

  parseNiveles(nivelPersonas: string): number[] {
    try {
      return JSON.parse(nivelPersonas);
    } catch {
      return [];
    }
  }
}
