import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonChip,
  IonIcon,
  IonLabel,
  IonInput,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  chatbubbleOutline,
  send,
  documentAttachOutline,
  cloudUploadOutline,
  closeCircleOutline,
  timeOutline,
  close,
  chevronForwardOutline,
} from 'ionicons/icons';

export interface Comment {
  author: string;
  authorAvatar?: string;
  text: string;
  date: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface BaseActivity {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  date: Date;
  comments?: Comment[];
  newComment?: string;
  attachments?: Attachment[];
  className?: string;
  classId?: string;
}

export interface Announcement extends BaseActivity {
  type: 'announcement';
}

export interface Assignment extends BaseActivity {
  type: 'assignment';
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded' | 'missing' | 'late';
  points?: number;
  totalPoints?: number;
  hasSubmission?: boolean;
}

export type Activity = Announcement | Assignment;

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonAvatar,
    IonChip,
    IonIcon,
    IonLabel,
    IonInput,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
  ]
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
  @Input() currentUserAvatar: string = 'assets/profile.svg';
  @Output() commentAdded = new EventEmitter<{ activity: Activity, comment: Comment }>();
  @Output() turnInClicked = new EventEmitter<Assignment>();
  @Output() attachmentClicked = new EventEmitter<Attachment>();
  @Output() cardClicked = new EventEmitter<Activity>();

  isCommentsModalOpen = false;
  maxPreviewComments = 2;

  constructor() {
    addIcons({
      calendarOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      chatbubbleOutline,
      send,
      documentAttachOutline,
      cloudUploadOutline,
      closeCircleOutline,
      timeOutline,
      close,
      chevronForwardOutline,
    });
  }

  isAssignment(activity: Activity): activity is Assignment {
    return activity.type === 'assignment';
  }

  isAnnouncement(activity: Activity): activity is Announcement {
    return activity.type === 'announcement';
  }

  get previewComments(): Comment[] {
    return this.activity.comments?.slice(0, this.maxPreviewComments) || [];
  }

  get hasMoreComments(): boolean {
    return (this.activity.comments?.length || 0) > this.maxPreviewComments;
  }

  onCardClick(event: Event) {
    // Don't trigger if clicking on interactive elements
    const target = event.target as HTMLElement;
    const isInteractive = target.closest('ion-button, ion-input, .add-comment, .comments-header');
    
    if (!isInteractive) {
      this.cardClicked.emit(this.activity);
    }
  }

  openCommentsModal() {
    this.isCommentsModalOpen = true;
  }

  closeCommentsModal() {
    this.isCommentsModalOpen = false;
  }

  addComment(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent card click
    }

    if (!this.activity.newComment?.trim()) {
      return;
    }

    const newComment: Comment = {
      author: 'Current User',
      authorAvatar: this.currentUserAvatar,
      text: this.activity.newComment.trim(),
      date: new Date()
    };

    if (!this.activity.comments) {
      this.activity.comments = [];
    }

    this.activity.comments.push(newComment);
    this.commentAdded.emit({ activity: this.activity, comment: newComment });
    this.activity.newComment = '';
  }

  onTurnIn() {
    if (this.isAssignment(this.activity)) {
      this.turnInClicked.emit(this.activity);
    }
  }

  onAttachmentClick(attachment: Attachment, event: Event) {
    event.stopPropagation(); // Prevent card click
    this.attachmentClicked.emit(attachment);
  }

  getStatusColor(status: Assignment['status']): string {
    switch(status) {
      case 'pending': return 'warning';
      case 'submitted': return 'success';
      case 'graded': return 'primary';
      case 'missing': return 'danger';
      case 'late': return 'warning';
      default: return 'medium';
    }
  }

  getStatusIcon(status: Assignment['status']): string {
    switch(status) {
      case 'submitted': return 'checkmark-circle-outline';
      case 'graded': return 'checkmark-circle-outline';
      case 'missing': return 'close-circle-outline';
      case 'late': return 'alert-circle-outline';
      default: return 'time-outline';
    }
  }

  getStatusText(status: Assignment['status']): string {
    switch(status) {
      case 'submitted': return 'Submitted';
      case 'graded': return 'Graded';
      case 'missing': return 'Missing';
      case 'late': return 'Late';
      default: return 'Pending';
    }
  }

  isOverdue(assignment: Assignment): boolean {
    return new Date() > new Date(assignment.dueDate) && 
           assignment.status === 'pending';
  }
}