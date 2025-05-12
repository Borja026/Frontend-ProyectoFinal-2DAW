import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clientes, ClientesService } from '../../services/clientes.service';
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

  constructor(private fb: FormBuilder, private clientesService: ClientesService, private router: Router) {
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

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        console.log('Datos de los Clientes recibidos:', data);
        this.datosClientes = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos de los Clientes', err);
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
  // ClientesService: any;





  toggleForm() {
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  showAlert(message: string, duration = 10000) {
    this.alertMessage = message;
    setTimeout(() => this.alertMessage = null, duration);
  }

  // Cuando se envía el formulario de inicio de sesión
  onLogin() {
    if (this.loginForm.valid) {
      const creds = this.loginForm.value;
      const hashedPassword = CryptoJS.SHA256(creds.password).toString();
  
      const cliente = this.datosClientes.find(c => 
        c.correo === creds.correo && c.password === hashedPassword
      );

      
      if (cliente) {
        console.log('Inicio de sesión exitoso');
        this.loginForm.reset();
        this.router.navigate(['/partidas']);
      } else {
        this.showAlert('Credenciales incorrectos. Por favor, inténtalo de nuevo.');
      }
    }
  }
  

  // Cuando se envía el formulario de registro
  onRegistro() {
    if (this.registroForm.valid) {
      this.registroData.push(this.registroForm.value);
      console.log('Registro:', this.registroForm.value);
      this.registroForm.reset(); // Reinicia el formulario después de enviar
      this.router.navigate(['/partidas']); // Redirige a la galería después de registrarse
    }
  }
}
