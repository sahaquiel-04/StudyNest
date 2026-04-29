import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet } from '@ionic/angular/standalone';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonToggle,
  IonModal,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButtons,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  moonOutline,
  personOutline,
  settingsOutline,
  logOutOutline,
  closeOutline,
  personCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonRouterOutlet,
    IonButtons,
    IonButton,
    IonIcon,
    IonAvatar,
    IonToggle,
    IonModal,
  ],
})
export class ProfilePage implements OnInit {
  username: string | null = null;
  profile: any = null;
  editing = false;

  // preview avatar while editing/uploading
  avatarPreview: string | null = null;

  // form fields
  fullName = '';
  email = '';
  phone = '';
  role = '';

  // dark mode state (persisted in localStorage)
  darkMode = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    public routerOutlet: IonRouterOutlet,
    private location: Location
  ) {
    addIcons({
      chevronBackOutline,
      moonOutline,
      personOutline,
      settingsOutline,
      logOutOutline,
      closeOutline,
      personCircleOutline,
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.username = localStorage.getItem('last_user');
    this.loadProfile();
    // initialize dark mode from localStorage or body class
    const saved = localStorage.getItem('dark_mode');
    if (saved !== null) {
      this.darkMode = saved === '1';
      document.documentElement.classList.toggle('dark', this.darkMode);
    } else {
      this.darkMode = document.documentElement.classList.contains('dark');
    }
  }

  triggerAvatarInput() {
    const el = document.getElementById('avatarInput') as HTMLInputElement | null;
    if (el) el.click();
  }

  toggleDarkMode(ev: CustomEvent) {
    this.darkMode = !!ev?.detail?.checked;
    document.documentElement.classList.toggle('dark', this.darkMode);
    localStorage.setItem('dark_mode', this.darkMode ? '1' : '0');
  }

  loadProfile() {
    this.profile = this.auth.getProfile(this.username);
    if (this.profile) {
      this.fullName = this.profile.fullName || '';
      this.email = this.profile.email || '';
      this.phone = this.profile.phone || '';
      this.role = this.profile.role || 'user';
      this.avatarPreview = this.profile.avatar || null;
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      this.avatarPreview = dataUrl;
      // persist immediately
      if (this.username) {
        this.auth.updateProfile(this.username, { avatar: dataUrl, updatedAt: new Date().toISOString() });
        this.loadProfile();
      }
    };
    reader.readAsDataURL(file);
    // clear the input so same file can be selected again if needed
    input.value = '';
  }

  startEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.loadProfile();
  }

  saveProfile() {
    if (!this.username) return;
    this.auth.updateProfile(this.username, {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      updatedAt: new Date().toISOString(),
    });
    this.editing = false;
    this.loadProfile();
  }

  goHome() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}