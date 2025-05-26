import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceIdCancelacion = 'service_2bdkzfg';
  private templateIdCancelacion = 'template_05qpt1z';
  private publicKeyCancelacion = 'lQm0BDZYAnXZ-j5Uy';
  
  private serviceIdConfirmacion = 'service_rqg1cbd';
  private templateIdConfirmacion = 'template_tdb24cb';
  private publicKeyConfirmacion = 'TWQizTGjcbOe7uKU_';

  constructor() { }

  enviarCorreoCancelacion(correoCliente: string, pista: number, fechaHora: string): void {
    const templateParams = {
      cliente_email: correoCliente,
      pista: pista,
      fecha_hora: fechaHora
    };

    emailjs.send(this.serviceIdCancelacion, this.templateIdCancelacion, templateParams, this.publicKeyCancelacion)
      .then(() => {
        console.log('Correo de cancelación enviado');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de cancelación:', error);
      });
  }


  enviarCorreoConfirmacionReserva(correoCliente: string, fechaHora: string, pista: number, numPersonas: number, mediaNivel: number): void {
    const templateParams = {
      cliente_email: correoCliente,
      fecha_hora: fechaHora,
      pista: pista,
      num_personas: numPersonas,
      media_nivel: mediaNivel
    };

    emailjs.send(this.serviceIdConfirmacion, this.templateIdConfirmacion, templateParams, this.publicKeyConfirmacion)
      .then(() => console.log('Correo de confirmación enviado'))
      .catch(error => console.error('Error al enviar confirmación:', error));
  }

}
