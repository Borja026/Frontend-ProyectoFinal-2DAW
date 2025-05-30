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
  esPasada: boolean;
}

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.css']
})
export class PartidasComponent implements OnInit {
  activePista: number | null = null;
  activeIndex: number | null = null;
  showButtons = false;
  showFriendLevels = false;
  friendLevels: string[] = [];
  reservarPista = false;
  numberFriends = 1;
  fechaSeleccionada = '';

  nivelCliente = 0;
  posicionCliente = 'Indiferente';
  correoCliente = '';

  pistas: PistaReservada[] = [];

  constructor(
    private partidasService: PartidasService,
    private emailService: EmailService,
    private router: Router
  ) { }

  // ngOnInit(): void {
  //   const correo = localStorage.getItem('usuarioCorreo');
  //   const nivel = localStorage.getItem('usuarioNivel');
  //   const posicion = localStorage.getItem('usuarioPosicion');

  //   if (correo) {
  //     this.correoCliente = correo;
  //     this.nivelCliente = nivel ? parseFloat(nivel) : 0;
  //     this.posicionCliente = posicion || 'Indiferente';
  //   }

  //   const hoy = new Date();
  //   hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  //   const fechaLocal = hoy.toISOString().split('T')[0];

  //   this.fechaSeleccionada = fechaLocal;
  //   this.cargarReservasPorFecha(fechaLocal);
  // }
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

    // ✅ Comprobamos si hay una reserva pendiente de correo
    const reservaPendiente = localStorage.getItem('reservaPendienteCorreo');
    if (reservaPendiente) {
      const reserva = JSON.parse(reservaPendiente);

      this.emailService.enviarCorreoConfirmacionReserva(
        reserva.correoClientes,
        reserva.fechaHora,
        reserva.idPistas,
        reserva.numPersonas,
        reserva.mediaNivel
      );

      localStorage.removeItem('reservaPendienteCorreo'); // evitar reenvíos
    }
  }


  cargarReservasPorFecha(fecha: string) {
    this.fechaSeleccionada = fecha;
    const horas = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:30'];
    const pistasIDs = [1, 2, 3];
    const nuevasPistas: PistaReservada[] = [];
    let pendingRequests = 0;

    horas.forEach(hora => {
      pistasIDs.forEach(id => {
        pendingRequests++;
        this.partidasService.getJugadoresPorPista(`${fecha} ${hora}:00`, id).subscribe(jugadores => {
          const jugadoresActivos = jugadores.filter(j => j.cancelada !== '1');
          const totalPersonas = jugadoresActivos.reduce((total, j) => total + Number(j.numPersonas || 0), 0);
          const reservadoPorClub = jugadoresActivos.some(j => j.correoClientes === 'club@dreampadel.com');

          const fechaHoraPista = new Date(`${fecha}T${hora}:00`);
          fechaHoraPista.setMinutes(fechaHoraPista.getMinutes() - fechaHoraPista.getTimezoneOffset());
          const esPasada = fechaHoraPista.getTime() < new Date().getTime();

          const pistaData: PistaReservada = {
            idPista: id,
            hora: hora,
            apuntados: totalPersonas,
            esPasada: esPasada,
            imagePista: this.obtenerImagenPista(totalPersonas, reservadoPorClub, esPasada),
            jugadores: jugadoresActivos
          };

          nuevasPistas.push(pistaData);
          pendingRequests--;

          if (pendingRequests === 0) {
            // Ordenamos por hora y opcionalmente por pista
            this.pistas = nuevasPistas.sort((a, b) => {
              const horaA = a.hora;
              const horaB = b.hora;
              if (horaA < horaB) return -1;
              if (horaA > horaB) return 1;
              return a.idPista - b.idPista;
            });
          }
        });
      });
    });
  }


  obtenerImagenPista(apuntados: number, reservadoPorClub: boolean, esPasada: boolean): string {
    if (esPasada) return 'pista_gris.png';
    if (reservadoPorClub || apuntados === 5) return 'pista_azul.png';
    if (apuntados === 0) return 'pista_verde.png';
    if (apuntados <= 3) return 'pista_naranja.png';
    if (apuntados === 4) return 'pista_roja.png';
    return 'pista_verde.png';
  }

  onImageClick(event: MouseEvent, index: number) {
    const pista = this.pistas[index];
    if (pista.esPasada) return;

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

    if (pista.apuntados >= 4 || pista.jugadores.some(j => j.correoClientes === 'club@dreampadel.com')) {
      alert('Esta pista ya está completa o reservada por el club.');
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
        localStorage.setItem('reservaPendienteCorreo', JSON.stringify(reserva));
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

    if (pista.apuntados + todosLosNiveles.length > 4 || pista.jugadores.some(j => j.correoClientes === 'club@dreampadel.com')) {
      alert('Esta pista ya está completa o reservada por el club.');
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
        localStorage.setItem('reservaPendienteCorreo', JSON.stringify(reserva));
        window.location.href = res.url;
      },
      error: err => alert(err.error?.message || 'Error al iniciar el pago.')
    });

    this.showFriendLevels = false;
    this.showButtons = false;
  }

  cancelarReserva(pista: PistaReservada) {
    const fechaHoraStr = `${this.fechaSeleccionada} ${pista.hora}:00`;
    const fechaHoraReserva = new Date(fechaHoraStr);
    const ahora = new Date();

    fechaHoraReserva.setMinutes(fechaHoraReserva.getMinutes() - fechaHoraReserva.getTimezoneOffset());
    const diferenciaEnHoras = (fechaHoraReserva.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diferenciaEnHoras < 10) {
      alert('No puedes cancelar la reserva. Faltan menos de 10 horas para que sea la hora de la reserva.');
      return;
    }

    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) return;

    this.partidasService.cancelarReserva({
      fechaHora: fechaHoraStr,
      idPistas: pista.idPista,
      correoClientes: this.correoCliente
    }).subscribe({
      next: () => {
        this.emailService.enviarCorreoCancelacion(this.correoCliente, pista.idPista, fechaHoraStr);
        this.cargarReservasPorFecha(this.fechaSeleccionada);
        alert('Reserva cancelada correctamente.');
      },
      error: err => {
        console.error('Error al cancelar reserva:', err);
        alert('No se pudo cancelar la reserva.');
      }
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
