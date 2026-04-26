import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardContent,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { ClassService, Class } from '../../services/class.service';
import { addIcons } from 'ionicons';
import { close, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-class-modal',
  templateUrl: './create-class-modal.component.html',
  styleUrls: ['./create-class-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonCard,
    IonCardContent,
  ]
})
export class CreateClassModalComponent {
  classData = {
    title: '',
    subtitle: '',
    name: '',
    content: '',
    avatar: 'assets/profile.svg'
  };

  constructor(
    private modalCtrl: ModalController,
    private classService: ClassService,
    private toastCtrl: ToastController
  ) {
    addIcons({ close, informationCircleOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onSubmit() {
    if (this.classData.title && this.classData.subtitle && this.classData.name) {
      const newClass = this.classService.createClass(this.classData);
      
      // Show success toast with class code
      const toast = await this.toastCtrl.create({
        message: `Class created! Code: ${newClass.classCode}`,
        duration: 5000,
        position: 'top',
        color: 'success',
        buttons: [
          {
            text: 'Copy Code',
            handler: () => {
              this.copyToClipboard(newClass.classCode);
            }
          }
        ]
      });
      await toast.present();

      this.modalCtrl.dismiss(newClass, 'created');
    }
  }

  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      const toast = await this.toastCtrl.create({
        message: 'Class code copied to clipboard!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}