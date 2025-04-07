import { Component } from '@angular/core';

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.css'],
})
export class PartidasComponent {
  // Estado del componente
  activePista: number | null = null; // Pista seleccionada
  activeIndex: number | null = null; // Índice de la pista seleccionada en el array
  showButtons: boolean = false; // Mostrar botones de acción
  showFriendLevels: boolean = false; // Mostrar niveles de amigos
  friendLevels: string[] = []; // Niveles de amigos
  reservarPista: boolean = false; // Indica si la pista está reservada
  numberFriends: number = 1; // Cantidad de amigos
  imagePista: string = 'pista_verde.png';

  // Datos de las pistas (id, id de la pista, hora, número de personas apuntadas)
  pistas: {
    id: number;
    idPista: number;
    hora: string;
    apuntados: number;
    imagePista: string;
  }[] = [
      {
        id: 1,
        idPista: 1,
        hora: '9:00',
        apuntados: 5,
        imagePista: 'pista_verde.png',
      },
      {
        id: 2,
        idPista: 2,
        hora: '9:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 3,
        idPista: 3,
        hora: '9:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 4,
        idPista: 1,
        hora: '10:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 5,
        idPista: 2,
        hora: '10:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 6,
        idPista: 3,
        hora: '10:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 7,
        idPista: 1,
        hora: '12:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 8,
        idPista: 2,
        hora: '12:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 9,
        idPista: 3,
        hora: '12:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 10,
        idPista: 1,
        hora: '13:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 11,
        idPista: 2,
        hora: '13:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 12,
        idPista: 3,
        hora: '13:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 13,
        idPista: 1,
        hora: '15:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 14,
        idPista: 2,
        hora: '15:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 15,
        idPista: 3,
        hora: '15:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 16,
        idPista: 1,
        hora: '16:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 17,
        idPista: 2,
        hora: '16:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 18,
        idPista: 3,
        hora: '16:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 19,
        idPista: 1,
        hora: '18:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 20,
        idPista: 2,
        hora: '18:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 21,
        idPista: 3,
        hora: '18:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 22,
        idPista: 1,
        hora: '19:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 23,
        idPista: 2,
        hora: '19:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 24,
        idPista: 3,
        hora: '19:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 25,
        idPista: 1,
        hora: '21:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 26,
        idPista: 2,
        hora: '21:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 27,
        idPista: 3,
        hora: '21:00',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 28,
        idPista: 1,
        hora: '22:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 29,
        idPista: 2,
        hora: '22:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
      {
        id: 30,
        idPista: 3,
        hora: '22:30',
        apuntados: 0,
        imagePista: 'pista_verde.png',
      },
    ];

  // Se ejecuta al hacer clic en una imagen de pista
  onImageClick(event: MouseEvent, index: number) {
    let target = event.currentTarget as HTMLElement;
    let idPista = target.getAttribute('data-id');
    let hora = target.getAttribute('data-hora');

    if (idPista && hora) {
      this.activeIndex = index;
      this.activePista = +idPista;
      this.showButtons = true;
      this.showFriendLevels = false;
      console.log("index: " + index);
      console.log(`Pista seleccionada: ${idPista}, Hora: ${hora}`);
    } else {
      console.error("Error: Atributos data-id o data-hora no encontrados.");
    }
  }

  apuntarseSolo() {
    const pista = this.pistas[this.activeIndex!];
    if (pista) {
      if (pista.apuntados < 4) {
        pista.apuntados += 1;
        this.cambiarImagenPista();
      }
    }
    this.showButtons = false;
  }

  // Apuntarse con amigos (recibe la cantidad de amigos)
  apuntarseConAmigos(cantidad: number) {
    if (cantidad > 0) {
      // Para mostrar los selects de los niveles de los amigos
      this.friendLevels = new Array(cantidad).fill('');
      this.showFriendLevels = true;
    }
    this.numberFriends = cantidad;
    console.log(`Apuntarse con ${cantidad} amigos`);
  }

  // Guardar los niveles de los amigos
  guardarNivelesAmigos(index: number) {
    console.log('index: ' + index);

    if (this.numberFriends === 1) {
      let select = document.getElementById('nivelAmigos1') as HTMLSelectElement;
      this.friendLevels.push(select.value);
      this.pistas[index].apuntados += 2;
      console.log('SE ENTRA EN EL IF DE 1 AMIGO');
    } else if (this.numberFriends === 2) {
      let select = document.getElementById('nivelAmigos2') as HTMLSelectElement;
      this.friendLevels.push(select.value);
      this.pistas[index].apuntados += 3;
      console.log('SE ENTRA EN EL IF DE 2 AMIGO');
    }
    console.log('Niveles de amigos:', this.friendLevels);
    console.log('Apuntados:' + this.pistas[index].apuntados);
    this.showFriendLevels = false;
    this.showButtons = false;
    this.cambiarImagenPista();
  }

  // Marcar la pista como reservada
  reservarPistaFunction(index: number) {
    console.log('index: ' + index);

    this.reservarPista = true;
    this.pistas[index].apuntados = 4;
    console.log('Apuntados:' + this.pistas[index].apuntados);
    console.log('Pista reservada');
    this.showButtons = false;
    this.cambiarImagenPista();
  }

  // Cambiar la imagen de la pista (lógica para actualizar el aspecto visual)
  cambiarImagenPista() {
    // Aquí se actualizaría el DOM o la ruta de la imagen según el estado
    const pista = this.pistas[this.activeIndex!];
    if (pista) {
      switch (pista.apuntados) {
        case 0:
          pista.imagePista = 'pista_verde.png';
          break;
        case 1:
        case 2:
        case 3:
          pista.imagePista = 'pista_naranja.png';
          break;
        case 4:
          pista.imagePista = 'pista_roja.png';
          break;
        case 5:
          pista.imagePista = 'pista_azul.png';
          break;
      }
    }
    if (this.activeIndex !== null) {
      console.log(this.pistas[this.activeIndex].apuntados + ' apuntados');
    }
  }

  // Crea un array del 1 hasta el número de amigos (para mostrar campos dinámicos en la plantilla)
  getFriendArray(): number[] {
    return Array.from({ length: this.numberFriends }, (_, i) => i + 1);
  }
}
