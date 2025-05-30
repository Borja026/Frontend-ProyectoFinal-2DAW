import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';



@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  @ViewChild('datePicker', { static: true }) datePicker!: ElementRef;
  @Output() fechaSeleccionada = new EventEmitter<string>();

  selectedDate: string = '';

  constructor() { }

  ngOnInit(): void {
    flatpickr(this.datePicker.nativeElement, {
      inline: true,          // Muestra el calendario siempre visible
      dateFormat: "Y-m-d",   // Formato de fecha
      minDate: "today",      // Deshabilita fechas anteriores a hoy
      locale: Spanish,      // Idioma español
      onChange: (selectedDates, dateStr) => {
        this.selectedDate = dateStr;
        this.fechaSeleccionada.emit(dateStr);  // ENVÍA LA FECHA AL PADRE
      }
    });
  }

}