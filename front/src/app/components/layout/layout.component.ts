import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AsideComponent } from '../aside/aside.component';
import { FooterComponent } from '../footer/footer.component';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, AsideComponent, FooterComponent, RouterOutlet, NgIf],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
