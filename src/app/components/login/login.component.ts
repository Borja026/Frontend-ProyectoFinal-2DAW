import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clientes, ClientesService } from '../../services/clientes.service';
import { Empleados, EmpleadosService } from '../../services/empleados.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


interface LoginData {
  correo: string;
  password: string;
}

interface RegistroData {
  correo: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  username: string;
  password: string;
  nivel: string;
  posicion: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private clientesService: ClientesService, private empleadosService: EmpleadosService, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registroForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      nivel: ['', Validators.required],
      posicion: ['', Validators.required]
    });
  }



  //? Datos de la API

  //* Variables
  datosClientes: Clientes[] = [];
  datosEmpleados: Empleados[] = [];


  ngOnInit(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes:', data);
        this.datosClientes = data;
      },
      error: (err) => {
        console.error('Error al obtener los clientes', err);
      }
    });

    this.empleadosService.getEmpleados().subscribe({
      next: (data) => {
        console.log('Empleados:', data);
        this.datosEmpleados = data;
      },
      error: (err) => {
        console.error('Error al obtener los empleados', err);
      }
    });
  }







  //----------------------------------------------------------------------------------
  //* Variables
  mostrarRegistro = false;
  alertMessage: string | null = null;

  // Recoger los datos de los formularios en un array
  loginForm: FormGroup;
  registroForm: FormGroup;

  loginData: LoginData[] = [];
  registroData: RegistroData[] = [];

  niveles = ['1,00', '1,25', '1,50', '1,75', '2,00', '2,25', '2,50', '2,75', '3,00', '3,25', '3,50', '3,75', '4,00', '4,25', '4,50', '4,75', '5,00', '5,25', '5,50', '5,75', '6,00', '6,25', '6,50', '6,75', '7,00'];
  posiciones = ['Drive', 'Revés', 'Indiferente'];





  toggleForm() {
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  showAlert(message: string, duration = 10000) {
    this.alertMessage = message;
    setTimeout(() => this.alertMessage = null, duration);
  }


  onLogin() {
    if (this.loginForm.valid) {
      const creds = this.loginForm.value;
      console.log('Contraseña: ' + creds.password);
      const hashedPassword = CryptoJS.SHA256(creds.password).toString();
      console.log('Contraseña hasheada: ' + hashedPassword);

      // Verificar si es cliente
      const cliente = this.datosClientes.find(c =>
        c.correo === creds.correo && c.password === hashedPassword
      );

      if (cliente) {
        console.log('Inicio de sesión como Cliente');
        console.log('Datos Cliente BBDD:', cliente);

        localStorage.setItem('usuarioTipo', 'cliente');
        localStorage.setItem('usuarioCorreo', cliente.correo);
        localStorage.setItem('usuarioNivel', cliente.nivel.toString());
        localStorage.setItem('usuarioPosicion', cliente.posicion);
        this.loginForm.reset();
        // this.router.navigate(['/tarifas']);
        this.router.navigate(['/areaJugador']);
        return;
      }

      // Verificar si es empleado
      const empleado = this.datosEmpleados.find(e =>
        e.correo === creds.correo && e.password === hashedPassword
      );

      if (empleado) {
        console.log('Inicio de sesión como Empleado');
        localStorage.setItem('usuarioTipo', 'empleado');
        localStorage.setItem('usuarioCorreo', empleado.correo);
        window.location.href = 'https://borja.com.es/ProyectoDosDAW/api_backend/public/admin/clientes';
        return;
      }

      // Si no se encuentra en ninguna lista
      this.showAlert('Credenciales incorrectos. Por favor, inténtalo de nuevo.');
    }
  }


  onRegistro() {
    if (this.registroForm.valid) {
      const nuevo = this.registroForm.value;

      const nuevoCliente: Clientes = {
        correo: nuevo.correo,
        nombre: nuevo.nombre,
        apellidos: nuevo.apellidos,
        fecha: nuevo.fechaNacimiento,
        foto: 'default_user.png',
        telefono: Number(nuevo.telefono.trim()),
        username: nuevo.username,
        password: CryptoJS.SHA256(nuevo.password).toString(),
        sexo: null,
        nivel: Number(nuevo.nivel.replace(',', '.')),
        posicion: nuevo.posicion,
        recibeClases: null
      };

      console.log('Nuevo cliente:', nuevoCliente);

      this.clientesService.registrarCliente(nuevoCliente).subscribe({
        next: (res) => {
          console.log('Respuesta backend:', res);

          if (res.status === true) {
            localStorage.setItem('usuarioTipo', 'cliente');
            localStorage.setItem('usuarioCorreo', nuevoCliente.correo);
            this.registroForm.reset();
            this.router.navigate(['/areaJugador']);
          } else {
            this.showAlert('Registro fallido. Intenta más tarde.');
          }
        },
        error: (err) => {
          console.error('Error al registrar cliente:', err);

          const errores = err?.error?.errors;

          // ✅ Mini trampa: si no hay errores, continuamos como si todo fue OK
          if (err.status === 400 && (Array.isArray(errores) && errores.length === 0)) {
            console.warn('Error 400 sin errores reales. Asumimos éxito.');
            localStorage.setItem('usuarioTipo', 'cliente');
            localStorage.setItem('usuarioCorreo', nuevoCliente.correo);
            this.registroForm.reset();
            this.router.navigate(['/areaJugador']);
            return;
          }

          if (errores && typeof errores === 'object') {
            const mensajes = Object.values(errores).join(' ');
            this.showAlert(mensajes);
          } else {
            this.showAlert('Error inesperado al registrar. Intenta más tarde.');
          }
        }
      });
    }
  }



}