import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton, IonButton, } from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton, IonButton]
})
export class SettingsPage implements OnInit {

  darkMode = false;
  emailNotifications = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    const saved = localStorage.getItem('dark_mode');
    if (saved !== null) {
      this.darkMode = saved === '1';
      document.documentElement.classList.toggle('dark', this.darkMode);
    } else {
      this.darkMode = document.documentElement.classList.contains('dark');
    }

    const notif = localStorage.getItem('email_notifications');
    this.emailNotifications = notif === '1';
  }

  toggleDarkMode(ev: CustomEvent) {
    this.darkMode = !!ev?.detail?.checked;
    document.documentElement.classList.toggle('dark', this.darkMode);
    localStorage.setItem('dark_mode', this.darkMode ? '1' : '0');
  }

  toggleEmailNotifications(ev: CustomEvent) {
    this.emailNotifications = !!ev?.detail?.checked;
    localStorage.setItem('email_notifications', this.emailNotifications ? '1' : '0');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }

}
