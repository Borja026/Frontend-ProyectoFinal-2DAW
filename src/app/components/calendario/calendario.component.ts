import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  @ViewChild('datePicker', { static: true }) datePicker!: ElementRef;
  selectedDate: string = '';

  constructor() { }

  ngOnInit(): void {
    flatpickr(this.datePicker.nativeElement, {
      inline: true,          // Muestra el calendario siempre visible
      dateFormat: "Y-m-d",   // Formato de fecha
      minDate: "today",      // Deshabilita fechas anteriores a hoy
      onChange: (selectedDates, dateStr) => {
        // Se actualiza la fecha seleccionada cada vez que el usuario elige un día
        this.selectedDate = dateStr;
      }
    });
  }
}
