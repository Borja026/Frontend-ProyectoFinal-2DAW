import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private renderer: Renderer2) { }

  toggleSubMenu(event: MouseEvent) {
    const clickedElement = event.currentTarget as HTMLElement;
    const clickedSubMenu = clickedElement.querySelector('ul.sublist') as HTMLElement;

    const isVisible = clickedSubMenu.style.display === 'block';

    const allSubMenus = document.querySelectorAll<HTMLElement>('ul.sublist');
    allSubMenus.forEach(submenu => {
      this.renderer.setStyle(submenu, 'display', 'none');
    });

    if (!isVisible) {
      this.renderer.setStyle(clickedSubMenu, 'display', 'block');
    }
  }
}
