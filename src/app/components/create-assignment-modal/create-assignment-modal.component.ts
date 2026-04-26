// ============================================
// create-assignment-modal.component.ts
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
  IonDatetime,
  IonDatetimeButton,
  IonModal,
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
  calendarOutline,
  timeOutline,
} from 'ionicons/icons';

export interface AssignmentFormData {
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
}

@Component({
  selector: 'app-create-assignment-modal',
  templateUrl: './create-assignment-modal.component.html',
  styleUrls: ['./create-assignment-modal.component.scss'],
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
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonChip,
    IonNote,
  ]
})
export class CreateAssignmentModalComponent implements OnInit {
  @Input() classId!: string;
  @Input() authorName!: string;
  @Input() authorAvatar!: string;

  assignmentTitle: string = '';
  assignmentDescription: string = '';
  dueDate: string = '';
  totalPoints: number = 100;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }> = [];

  minDate: string = '';
  maxDate: string = '';

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      closeOutline,
      attachOutline,
      closeCircleOutline,
      calendarOutline,
      timeOutline,
    });
  }

  ngOnInit() {
    this.initializeDates();
  }

  initializeDates() {
    const now = new Date();
    this.minDate = now.toISOString();
    
    // Set max date to 1 year from now
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    this.maxDate = maxDate.toISOString();

    // Set default due date to 7 days from now
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 7);
    defaultDue.setHours(23, 59, 0, 0);
    this.dueDate = defaultDue.toISOString();
  }

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

  async createAssignment() {
    // Validation
    if (!this.assignmentTitle.trim()) {
      await this.showToast('Please enter an assignment title', 'warning');
      return;
    }

    if (!this.assignmentDescription.trim()) {
      await this.showToast('Please enter a description', 'warning');
      return;
    }

    if (!this.dueDate) {
      await this.showToast('Please select a due date', 'warning');
      return;
    }

    if (this.totalPoints <= 0) {
      await this.showToast('Total points must be greater than 0', 'warning');
      return;
    }

    const assignmentData: AssignmentFormData = {
      title: this.assignmentTitle.trim(),
      description: this.assignmentDescription.trim(),
      dueDate: new Date(this.dueDate),
      totalPoints: this.totalPoints,
      attachments: this.attachments
    };

    this.modalCtrl.dismiss(assignmentData, 'confirm');
  }

  isFormValid(): boolean {
    return this.assignmentTitle.trim().length > 0 &&
           this.assignmentDescription.trim().length > 0 &&
           this.dueDate.length > 0 &&
           this.totalPoints > 0;
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

  formatDueDate(): string {
    if (!this.dueDate) return 'Not set';
    
    const date = new Date(this.dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    
    if (diffDays === 0) {
      return `Today, ${formattedDate}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${formattedDate}`;
    } else if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days, ${formattedDate}`;
    } else {
      return formattedDate;
    }
  }
}

