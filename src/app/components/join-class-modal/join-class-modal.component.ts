import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon, IonInput, IonItem, IonLabel,
  ModalController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { ClassService} from '../../services/class.service';

@Component({
  selector: 'app-join-class-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonIcon, IonInput, IonItem, IonLabel,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Join Class</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" >
      <p style="color: var(--ion-color-medium); margin-bottom: 20px;">
        Enter the 6-digit class code provided by your instructor.
      </p>

      <ion-item>
        <ion-label position="stacked">Class Code</ion-label>
        <ion-input
          [(ngModel)]="classCode"
          placeholder="e.g. ABC123"
          maxlength="6"
          style="text-transform: uppercase;">
        </ion-input>
      </ion-item>

      <ion-button
        expand="block"
        color="primary"
        style="margin-top: 24px;"
        [disabled]="classCode.length !== 6"
        (click)="join()">
        Join
      </ion-button>

      <div style="height: 40px;"></div>
    </ion-content>
  `
})
export class JoinClassModalComponent {
  classCode = '';

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private classService: ClassService
  ) {
    addIcons({ closeOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async join() {
    const code = this.classCode.trim().toUpperCase();
    const success = this.classService.joinClass(code);

    const toast = await this.toastCtrl.create({
      message: success ? 'Successfully joined the class! 🎉' : 'Invalid class code. Please try again.',
      duration: 2000,
      position: 'top',
      color: success ? 'success' : 'danger'
    });
    await toast.present();

    if (success) this.modalCtrl.dismiss();
  }
}