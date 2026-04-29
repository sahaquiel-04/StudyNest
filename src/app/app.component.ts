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
    const saved = localStorage.getItem('dark_mode');
    if (saved !== null) {
      this.applyDarkMode(saved === '1');
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.applyDarkMode(prefersDark.matches);
  }

  private applyDarkMode(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark);
  }

  async navigateToProfile() {
    await this.router.navigate(['/profile']);
    this.menuCtrl.close('main-menu');
  }

  async navigateToHome() {
    await this.router.navigate(['/home']);
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