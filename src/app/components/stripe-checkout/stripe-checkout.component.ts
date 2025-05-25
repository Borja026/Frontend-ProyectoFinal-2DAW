import { Component, Input, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-checkout',
  template: `<button (click)="pagar()">Pagar con tarjeta</button>`
})
export class StripeCheckoutComponent implements OnInit {
  @Input() pagoId: string = '';
  stripe: Stripe | null = null;

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51QbmF8CrkoAa5dSvluOprMq8IInx89zMIiRXS0wqeWxZEoAFXpPlPNWHA3CbKcKqgIlLUaOjScoJmcTnrXTFdUlO00pv7dUUuc'); // tu clave pública real aquí
  }

  async pagar() {
    if (!this.stripe || !this.pagoId) return;

    this.stripe.redirectToCheckout({
      sessionId: this.pagoId
    });
  }
}
