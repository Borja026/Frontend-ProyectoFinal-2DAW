// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class EmailService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_2bdkzfg';
  private templateId = 'template_05qpt1z';
  private publicKey = 'lQm0BDZYAnXZ-j5Uy';

  constructor() { }

  enviarCorreoCancelacion(correoCliente: string, pista: number, fechaHora: string): void {
    const templateParams = {
      cliente_email: correoCliente,
      pista: pista,
      fecha_hora: fechaHora
    };

    emailjs.send(this.serviceId, this.templateId, templateParams, this.publicKey)
      .then(() => {
        console.log('Correo de cancelación enviado');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de cancelación:', error);
      });
  }
}
