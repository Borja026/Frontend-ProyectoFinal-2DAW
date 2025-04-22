import { Component, OnInit } from '@angular/core';
import { GaleriaService, Galeria } from '../../services/galeria.service';
import { CategoriasService, Categorias } from '../../services/categorias.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})

export class GaleriaComponent implements OnInit {
  //* Variables
  fotos: Galeria[] = [];
  categorias: Categorias[] = [];
  categoriaSeleccionada: number = 2;
  nombreCarpeta: string = 'Torneo_Americano_de_Abril';

  constructor(private galeriaService: GaleriaService, private categoriasService: CategoriasService) { }


  ngOnInit(): void {
    this.galeriaService.getGaleria().subscribe({
      next: (data) => {
        console.log('Galería recibida:', data);
        this.fotos = data;
      },
      error: (err) => {
        console.error('Error al obtener la galería', err);
      }
    });

    this.categoriasService.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías recibidas:', data);
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
  }

  galeriaFiltrada(idCategoria: number) {
    return this.fotos.filter(image => image.idCategoria === idCategoria);
  }





  mostrarIdCatagoria(id: number, nombre: string){
    console.log('ID de la categoría: ' + id);
    console.log('Nombre de la categoría: ' + nombre);
    this.categoriaSeleccionada = id;
    this.nombreCarpeta = nombre;
  }
}
