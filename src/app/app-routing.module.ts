import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PartidasComponent } from './components/partidas/partidas.component';
import { TarifasComponent } from './components/tarifas/tarifas.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'partidas',
    component: PartidasComponent
  },
  {
    path: 'tarifas',
    component: TarifasComponent
  },
  {
    path: 'galeria',
    component: GaleriaComponent
  },
  {
    path: 'contacto',
    component: ContactoComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { // ERROR PAGE 404
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
