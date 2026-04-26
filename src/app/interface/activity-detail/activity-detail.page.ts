// activity-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonAvatar,
  IonInput,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisVertical,
  checkmarkCircle,
  closeCircleOutline,
  send,
} from 'ionicons/icons';
import { ClassService, Activity, Assignment, Comment } from '../../services/class.service';
import { Attachment } from '../../components/activity-card/activity-card.component';
import { FileService, FileAttachment } from '../../services/file.service';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.page.html',
  styleUrls: ['./activity-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonAvatar,
    IonInput,
  ]
})
export class ActivityDetailPage implements OnInit {
  activity?: Activity;
  activityId: string = '';
  classId: string = '';
  newComment: string = '';
  currentUserAvatar: string = 'assets/profile.svg';
  currentUserName: string = 'Current User'; // TODO: Get from auth service
  
  // Turn in submission
  submissionNote: string = '';
  submittedFiles: FileAttachment[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private classService: ClassService,
    private fileService: FileService
  ) {
    addIcons({
      chevronBackOutline,
      ellipsisVertical,
      checkmarkCircle,
      closeCircleOutline,
      send,
    });
  }

  ngOnInit() {
    this.activityId = this.route.snapshot.paramMap.get('activityId') || '';
    this.classId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Activity Detail - ClassID:', this.classId, 'ActivityID:', this.activityId);
    this.loadActivity();
  }

  loadActivity() {
    // Load from class service
    const activities = this.classService.getActivities(this.classId);
    this.activity = activities.find(a => a.id === this.activityId);

    if (!this.activity) {
      // Activity not found, navigate back
      console.error('Activity not found:', this.activityId);
      this.goBack();
    }
  }

  goBack() {
    // Navigate back using browser history
    this.location.back();
  }

  isAssignment(activity: Activity): activity is Assignment {
    return activity.type === 'assignment';
  }

  async turnInAssignment() {
    if (!this.activity || !this.isAssignment(this.activity)) return;

    if (this.submittedFiles.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Please attach at least one file before turning in',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Turn in Assignment',
      message: 'Are you sure you want to turn in this assignment? You can unsubmit and make changes until the due date.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Turn In',
          handler: () => {
            this.submitAssignment();
          }
        }
      ]
    });

    await alert.present();
  }

  async submitAssignment() {
    if (!this.activity || !this.isAssignment(this.activity)) return;

    // Update the activity status through class service
    const success = this.classService.updateActivityStatus(
      this.classId, 
      this.activityId, 
      'submitted'
    );

    if (success) {
      // Reload the activity to get updated data
      this.loadActivity();

      const toast = await this.toastCtrl.create({
        message: 'Assignment submitted successfully! 🎉',
        duration: 2500,
        position: 'top',
        color: 'success'
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Failed to submit assignment',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }

  async unsubmitAssignment() {
    if (!this.activity || !this.isAssignment(this.activity)) return;

    const alert = await this.alertCtrl.create({
      header: 'Unsubmit Assignment',
      message: 'Are you sure you want to unsubmit? You can make changes and turn it in again.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Unsubmit',
          handler: async () => {
            // Update the activity status
            const success = this.classService.updateActivityStatus(
              this.classId, 
              this.activityId, 
              'pending'
            );

            if (success) {
              // Reload the activity to get updated data
              this.loadActivity();

              const toast = await this.toastCtrl.create({
                message: 'Assignment unsubmitted',
                duration: 2000,
                position: 'top',
                color: 'medium'
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async addComment() {
    if (!this.newComment.trim() || !this.activity) return;

    const comment: Comment = {
      author: this.currentUserName,
      authorAvatar: this.currentUserAvatar,
      text: this.newComment.trim(),
      date: new Date()
    };

    // Add comment through class service
    const success = this.classService.addComment(
      this.classId, 
      this.activityId, 
      comment
    );

    if (success) {
      // Reload the activity to get updated comments
      this.loadActivity();

      this.newComment = '';

      const toast = await this.toastCtrl.create({
        message: 'Comment added',
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Failed to add comment',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }

  downloadAttachment(attachment: Attachment) {
    console.log('Downloading:', attachment.name);
    
    // Use FileService to download if it's a FileAttachment
    if ('file' in attachment) {
      this.fileService.downloadFile(attachment as FileAttachment);
    } else if (attachment.url && attachment.url !== '#') {
      // Fallback for regular attachments
      window.open(attachment.url, '_blank');
    } else {
      // Show message if no valid URL
      this.toastCtrl.create({
        message: 'Download not available for this file',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      }).then(toast => toast.present());
    }
  }

  async attachFile() {
    try {
      // Use FileService to pick files
      const selectedFiles = await this.fileService.pickFiles(true);
      
      if (selectedFiles.length === 0) {
        return; // User cancelled
      }

      // Add selected files to submitted files
      this.submittedFiles.push(...selectedFiles);
      
      const toast = await this.toastCtrl.create({
        message: `${selectedFiles.length} file(s) attached`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Error attaching files:', error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to attach files',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  removeFile(file: FileAttachment) {
    // Revoke the object URL to free memory
    if (file.url) {
      this.fileService.revokeFileUrl(file.url);
    }
    this.submittedFiles = this.submittedFiles.filter(f => f.id !== file.id);
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

  isOverdue(): boolean {
    if (!this.activity || !this.isAssignment(this.activity)) return false;
    return new Date() > new Date(this.activity.dueDate) && 
           this.activity.status === 'pending';
  }

  get canSubmit(): boolean {
    if (!this.activity || !this.isAssignment(this.activity)) return false;
    return this.activity.status === 'pending';
  }

  get canUnsubmit(): boolean {
    if (!this.activity || !this.isAssignment(this.activity)) return false;
    return this.activity.status === 'submitted';
  }
}