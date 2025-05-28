import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor() { }

  menuAbierto = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  sesionIniciada(): boolean {
    const correoGuardado = localStorage.getItem('usuarioCorreo');
    return correoGuardado !== null && correoGuardado !== '';
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioCorreo');
    localStorage.removeItem('usuarioTipo');
    localStorage.removeItem('usuarioNivel');
    localStorage.removeItem('usuarioPosicion');
  }
}
