import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonApp,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonIcon,
  MenuController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRouterOutlet,
    IonIcon,
  ]
})
export class AppComponent {
  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.applyDarkMode(prefersDark.matches);
    prefersDark.addEventListener('change', (event) => {
      this.applyDarkMode(event.matches);
    });
  }

  private applyDarkMode(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }

  async navigateToProfile() {
    await this.router.navigate(['/profile']);
    this.menuCtrl.close('main-menu');
  }

  async navigateToHome() {
    await this.router.navigate(['/tabs/tab1']);
    this.menuCtrl.close('main-menu');
  }

  async navigateToSettings() {
    await this.router.navigate(['/settings']);
    this.menuCtrl.close('main-menu');
  }

  async logout() {
    localStorage.removeItem('token');
    await this.menuCtrl.close('main-menu');
    this.router.navigate(['/auth/login']);
  }
}