import { Component, OnInit } from '@angular/core';
import { Clientes, ClientesService } from '../../services/clientes.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-area-jugador',
  templateUrl: './area-jugador.component.html',
  styleUrls: ['./area-jugador.component.css']
})
export class AreaJugadorComponent implements OnInit {
  cliente: Clientes | undefined;
  editMode: boolean = false;
  clienteOriginal: Clientes | undefined;
  selectedFile: File | null = null;

  constructor(private clienteService: ClientesService, private http: HttpClient) { }

  ngOnInit(): void {
    const correoGuardado = localStorage.getItem('usuarioCorreo');

    if (correoGuardado) {
      this.clienteService.getClientes().subscribe(clientes => {
        const encontrado = clientes.find(c => c.correo === correoGuardado);
        if (encontrado) {
          // encontrado.fecha = new Date(encontrado.fecha);
          encontrado.fecha = encontrado.fecha;
          this.cliente = { ...encontrado } as Clientes;
          this.clienteOriginal = { ...encontrado } as Clientes;
        }
      });
    } else {
      console.warn('No se encontró correo de usuario en localStorage');
    }
  }

  activarEdicion(): void {
    this.editMode = true;
  }

  cancelarEdicion(): void {
    if (this.clienteOriginal) {
      this.cliente = { ...this.clienteOriginal };
    }
    this.editMode = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  guardarCambios(): void {
    if (this.cliente) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('imagen', this.selectedFile);
        formData.append('correo', this.cliente.correo);
        formData.append('anterior', this.cliente.foto || '');

        this.http.post<any>('https://borja.com.es/ProyectoDosDAW/api_backend/public/api/subirImagenCliente', formData)
          .subscribe({
            next: (respuesta) => {
              this.cliente!.foto = respuesta.nuevaImagen;
              // this.cliente!.fecha = new Date(this.cliente!.fecha); // Aseguramos que la fecha sea un objeto Date
              this.cliente!.fecha = this.cliente!.fecha;
              this.guardarCliente();
            },
            error: (err) => {
              console.error('Error al subir la imagen:', err);
              alert('Error al subir la imagen');
            }
          });
      } else {
        this.guardarCliente();
      }
    }
  }



  private guardarCliente(): void {
    if (this.cliente) {
      this.clienteService.actualizarCliente(this.cliente).subscribe({
        next: (res) => {
          console.log('Cliente actualizado con éxito:', res);
          alert('Datos actualizados correctamente');
          this.clienteOriginal = { ...this.cliente } as Clientes;
          this.editMode = false;
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Error al actualizar cliente:', err);
          alert('Error al actualizar los datos');
        }
      });
    }
  }

  formatearFechaInput(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
