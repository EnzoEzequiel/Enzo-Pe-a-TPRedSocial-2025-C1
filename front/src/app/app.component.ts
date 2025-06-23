import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AsideComponent } from './components/aside/aside.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SpinnerService } from './services/spinner.service';
import { AuthService } from './services/auth/auth.service';
import { SpinnerComponent } from './components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AsideComponent,FooterComponent,CommonModule,SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showNavbarAndFooter: boolean = false;
  loading;
  sessionModalOpen = false;
  sessionTimerDuration = 10 * 60 * 1000; // 10 minutes

  /**
   * Constructor de la clase AppComponent.
   * @param {Router} router - El servicio Router de Angular, utilizado para gestionar la navegación y los eventos de navegación en la aplicación.
   */
  constructor(private router: Router, public spinner: SpinnerService, private auth: AuthService) {
    this.loading = this.spinner.loading;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Nos suscribimos a los eventos de navegación para detectar cuando la navegación ha terminado.
   * Dependiendo de la URL, decidimos si mostrar el Navbar y el Footer.
   * @returns {void}
   */
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbarAndFooter = event.url.includes('/home') || event.url.includes('/profile');
    });
    // On startup, verify JWT
    this.spinner.show();
    this.auth.authorize().then(valid => {
      this.spinner.hide();
      if (!valid) {
        this.router.navigate(['/auth']);
      } else {
        this.startSessionTimer();
      }
    });
  }

  startSessionTimer() {
    this.auth.startSessionTimer(this.sessionTimerDuration, () => {
      this.sessionModalOpen = true;
    });
  }

  extendSession() {
    this.spinner.show();
    this.auth.refreshToken().then(token => {
      this.spinner.hide();
      if (token) {
        this.sessionModalOpen = false;
        this.startSessionTimer();
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }

  cancelSession() {
    this.sessionModalOpen = false;
    this.auth.logout();
  }
}
