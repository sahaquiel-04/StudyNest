import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton, } from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonToggle, IonButtons, IonBackButton,]
})
export class SettingsPage implements OnInit {

  toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  }

  constructor() { }

  ngOnInit() {
  }

}
