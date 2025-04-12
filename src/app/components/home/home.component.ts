import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  subMenuVisible: boolean = false;

  toggleSubMenu(event: MouseEvent) {
    this.subMenuVisible = !this.subMenuVisible;

    let element = event.currentTarget as HTMLElement;
    let subMenu = element.getElementsByTagName('ul')[0];
    console.log(subMenu);
    subMenu.style.display = this.subMenuVisible ? 'block' : 'none';
  }
}
