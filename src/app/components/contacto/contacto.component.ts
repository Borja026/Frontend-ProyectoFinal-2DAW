import { Component } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  formData = {
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    pais: 'España',
    area: '',
    mensaje: '',
    conocido: ''
  };

  enviarFormulario(form: NgForm) {
    if (form.invalid) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    emailjs.send('service_2bdkzfg', 'template_3vftu9b', this.formData, 'lQm0BDZYAnXZ-j5Uy')
      .then((response: EmailJSResponseStatus) => {
        alert('Correo enviado con éxito.');
        form.resetForm();  // reset del formulario
      }, (error) => {
        alert('Error al enviar el correo.');
        console.error(error);
      });
  }
}
