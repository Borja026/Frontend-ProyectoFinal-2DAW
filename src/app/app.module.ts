import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PartidasComponent } from './components/partidas/partidas.component';
import { TarifasComponent } from './components/tarifas/tarifas.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AreaJugadorComponent } from './components/area-jugador/area-jugador.component';
import { StripeCheckoutComponent } from './components/stripe-checkout/stripe-checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PartidasComponent,
    TarifasComponent,
    GaleriaComponent,
    ContactoComponent,
    CalendarioComponent,
    LoginComponent,
    AreaJugadorComponent,
    StripeCheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
