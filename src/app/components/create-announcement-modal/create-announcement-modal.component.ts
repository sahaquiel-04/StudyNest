// ============================================
// create-announcement-modal.component.ts
// ============================================
import { Component, OnInit, Input } from '@angular/core';
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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonChip,
  IonNote,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  attachOutline,
  closeCircleOutline,
} from 'ionicons/icons';

export interface AnnouncementFormData {
  title: string;
  description: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
}

@Component({
  selector: 'app-create-announcement-modal',
  templateUrl: './create-announcement-modal.component.html',
  styleUrls: ['./create-announcement-modal.component.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonChip,
    IonNote,
  ]
})
export class CreateAnnouncementModalComponent implements OnInit {
  @Input() classId!: string;
  @Input() authorName!: string;
  @Input() authorAvatar!: string;

  announcementTitle: string = '';
  announcementDescription: string = '';
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }> = [];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      closeOutline,
      attachOutline,
      closeCircleOutline,
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async attachFile() {
    // TODO: Implement actual file picker
    // For now, simulate adding a file
    const mockFile = {
      id: Date.now().toString(),
      name: `Document_${this.attachments.length + 1}.pdf`,
      type: 'PDF',
      size: '2.4 MB',
      url: '#'
    };
    
    this.attachments.push(mockFile);
    
    const toast = await this.toastCtrl.create({
      message: 'File attached',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  removeAttachment(attachmentId: string) {
    this.attachments = this.attachments.filter(a => a.id !== attachmentId);
  }

  async createAnnouncement() {
    // Validation
    if (!this.announcementTitle.trim()) {
      await this.showToast('Please enter an announcement title', 'warning');
      return;
    }

    if (!this.announcementDescription.trim()) {
      await this.showToast('Please enter a message', 'warning');
      return;
    }

    const announcementData: AnnouncementFormData = {
      title: this.announcementTitle.trim(),
      description: this.announcementDescription.trim(),
      attachments: this.attachments
    };

    this.modalCtrl.dismiss(announcementData, 'confirm');
  }

  isFormValid(): boolean {
    return this.announcementTitle.trim().length > 0 &&
           this.announcementDescription.trim().length > 0;
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await toast.present();
  }
}