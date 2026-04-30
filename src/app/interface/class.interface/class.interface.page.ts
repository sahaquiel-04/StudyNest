import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonBadge,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonInput,
  ToastController,
  PopoverController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  notificationsOutline,
  ellipsisVerticalOutline,
  downloadOutline,
  documentTextOutline,
  personOutline,
  addCircle, 
  documentText,
  chatbubbleEllipses,
  copyOutline,
  exitOutline,
  settingsOutline,
  trashOutline,
  pencilOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { 
  ClassService, 
  Class, 
  ClassWithRole, 
  Activity, 
  Material, 
  Comment 
} from '../../services/class.service';
import { 
  ActivityCardComponent, 
  Attachment
} from '../../components/activity-card/activity-card.component';

// Import the popover component
import { ClassOptionsPopoverComponent } from '../../components/class-options-popover/class-options-popover.component';
import { ModalController } from '@ionic/angular/standalone';
import { CreateAssignmentModalComponent, AssignmentFormData } from '../../components/create-assignment-modal/create-assignment-modal.component';
import { CreateAnnouncementModalComponent, AnnouncementFormData } from '../../components/create-announcement-modal/create-announcement-modal.component';
import { FileService } from '../../services/file.service';

interface Classmate {
  id: string;
  name: string;
  avatar: string;
  role: 'teacher' | 'student';
}

@Component({
  selector: 'app-class-interface',
  templateUrl: './class.interface.page.html',
  styleUrls: ['./class.interface.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonAvatar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    IonBadge,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonFabList,
    IonInput,
    ActivityCardComponent,
  ]
})
export class ClassInterfacePage implements OnInit {
  selectedSegment: string = 'activities';
  classData?: ClassWithRole;
  classId: string = '';

  activities: Activity[] = [];
  classmates: Classmate[] = [];
  materials: Material[] = [];

  // Current user info
  currentUser = {
    name: 'Current User',
    avatar: 'assets/profile.svg'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private fileService: FileService,
    private authService: AuthService,
  ) {
    addIcons({
      arrowBackOutline,
      searchOutline,
      notificationsOutline,
      ellipsisVerticalOutline,
      downloadOutline,
      documentTextOutline,
      personOutline,
      addCircle, 
      documentText,
      chatbubbleEllipses,
      copyOutline,
      exitOutline,
      settingsOutline,
      trashOutline,
      pencilOutline,
      informationCircleOutline,
    });
  }

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCurrentUser();
    if (this.classId) {
      this.loadClassData();
    }
  }

  loadCurrentUser() {
  const username = localStorage.getItem('last_user');
  const profile = this.authService.getProfile(username);
  if (profile) {
    this.currentUser = {
      name: profile.fullName || username?.split('@')[0] || 'User',
      avatar: profile.avatar || 'assets/profile.svg'
    };
  }
}

  loadClassData() {
    const classData = this.classService.getClassById(this.classId);
    
    if (!classData) {
      // Class not found, navigate back
      this.router.navigate(['/classes']);
      return;
    }

    // Add user role to class data
    this.classData = this.addUserRole(classData);
    
    // Load actual data from service
    this.loadActivities();
    this.loadMaterials();
    this.loadClassmates();
  }

  private addUserRole(classData: Class): ClassWithRole {
    const userId = this.classService.getCurrentUserId();
    const isTeacher = classData.teacherId === userId;
    const isStudent = classData.students.some(s => s.userId === userId);
    
    let userRole: 'teacher' | 'student' | 'both';
    if (isTeacher && isStudent) {
      userRole = 'both';
    } else if (isTeacher) {
      userRole = 'teacher';
    } else {
      userRole = 'student';
    }
    
    return { ...classData, userRole };
  }

  loadActivities() {
    this.activities = this.classService.getActivities(this.classId);
  }

  loadMaterials() {
    this.materials = this.classService.getMaterials(this.classId);
  }

 loadClassmates() {
  if (!this.classData) return;

  this.classmates = [];

  const currentUserId = this.classService.getCurrentUserId();

  // If current user is the teacher, use currentUser info instead
  const teacherName = this.classData.teacherId === currentUserId
    ? this.currentUser.name
    : this.classData.teacherName;

  const teacherAvatar = this.classData.teacherId === currentUserId
    ? this.currentUser.avatar
    : this.classData.teacherAvatar;

  this.classmates.push({
    id: this.classData.teacherId,
    name: teacherName,
    avatar: teacherAvatar,
    role: 'teacher'
  });

  this.classData.students.forEach(student => {
    this.classmates.push({
      id: student.userId,
      name: student.name,
      avatar: student.avatar,
      role: 'student'
    });
  });
}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  goBack() {
    this.router.navigate(['/classes']);
  }

  downloadMaterial(material: Material) {
    console.log('Downloading:', material.name);
    // Implement download logic
  }

  async onCommentAdded(event: { activity: Activity, comment: Comment }) {
    // Save comment to service
    const success = this.classService.addComment(
      this.classId, 
      event.activity.id, 
      event.comment
    );

    if (success) {
      // Show success toast
      const toast = await this.toastCtrl.create({
        message: 'Comment added',
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      
      // Reload activities to get updated data
      this.loadActivities();
    }
  }

  onActivityCardClick(activity: Activity) {
    // Navigate to activity detail page
    this.router.navigate(['/interface/class-interface', this.classId, 'activity', activity.id]);
  }

  async onAttachmentClicked(attachment: Attachment) {
  console.log('Opening attachment:', attachment);
  
  // Create an alert to choose action
  const alert = await this.alertCtrl.create({
    header: attachment.name,
    message: `Size: ${attachment.size} • Type: ${attachment.type}`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Download',
        handler: () => {
          this.downloadAttachment(attachment);
        }
      },
      {
        text: 'Open',
        handler: () => {
          this.openAttachment(attachment);
        }
      }
    ]
  });

  await alert.present();
}

private downloadAttachment(attachment: Attachment) {
  // Use FileService to download
  this.fileService.downloadFile(attachment);
  
  this.showToast(`Downloading ${attachment.name}...`, 'primary');
}

private openAttachment(attachment: Attachment) {
  // Use FileService to open in new tab
  this.fileService.openFile(attachment);
  
  this.showToast(`Opening ${attachment.name}...`, 'primary');
}

private async showToast(message: string, color: string) {
  const toast = await this.toastCtrl.create({
    message,
    duration: 1500,
    position: 'bottom',
    color
  });
  await toast.present();
}

  // Helper method to check user's role
  get isTeacher(): boolean {
    return this.classData?.userRole === 'teacher' || this.classData?.userRole === 'both';
  }

  get isStudent(): boolean {
    return this.classData?.userRole === 'student' || this.classData?.userRole === 'both';
  }

  get hasBothRoles(): boolean {
    return this.classData?.userRole === 'both';
  }

  // Get total member count
  get memberCount(): number {
    return this.classmates.length;
  }

 async openCreateAnnouncement() {
  if (!this.isTeacher || !this.classData) return;

  const modal = await this.modalCtrl.create({
    component: CreateAnnouncementModalComponent,
    componentProps: {
      classId: this.classId,
      authorName: this.classData.teacherName,
      authorAvatar: this.classData.teacherAvatar
    }
  });

  await modal.present();

  const { data, role } = await modal.onWillDismiss<AnnouncementFormData>();

  if (role === 'confirm' && data) {
    // Create the announcement
    const newAnnouncement = this.classService.addActivity(this.classId, {
      type: 'announcement',
      title: data.title,
      description: data.description,
      author: this.classData.teacherName,
      authorAvatar: this.classData.teacherAvatar,
      date: new Date(),
      comments: [],
      attachments: data.attachments
    } as Omit<Activity, 'id'>);

    if (newAnnouncement) {
      // Show success message
      const toast = await this.toastCtrl.create({
        message: 'Announcement posted successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      // Reload activities to show the new announcement
      this.loadActivities();
    }
  }
}

  async openCreateAssignment() {
  if (!this.isTeacher || !this.classData) return;

  const modal = await this.modalCtrl.create({
    component: CreateAssignmentModalComponent,
    componentProps: {
      classId: this.classId,
      authorName: this.classData.teacherName,
      authorAvatar: this.classData.teacherAvatar
    }
  });

  await modal.present();

  const { data, role } = await modal.onWillDismiss<AssignmentFormData>();

  if (role === 'confirm' && data) {
    // Create the assignment
    const newAssignment = this.classService.addActivity(this.classId, {
      type: 'assignment',
      title: data.title,
      description: data.description,
      author: this.classData.teacherName,
      authorAvatar: this.classData.teacherAvatar,
      date: new Date(),
      dueDate: data.dueDate,
      status: 'pending',
      totalPoints: data.totalPoints,
      comments: [],
      attachments: data.attachments
    } as Omit<Activity, 'id'>);

    if (newAssignment) {
      // Show success message
      const toast = await this.toastCtrl.create({
        message: 'Assignment created successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      // Reload activities to show the new assignment
      this.loadActivities();
    }
  }
}



  async openMoreOptions(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: ClassOptionsPopoverComponent,
      event: event,
      translucent: true,
      componentProps: {
        isTeacher: this.isTeacher,
        classCode: this.classData?.classCode
      }
    });

    await popover.present();

    const { data, role } = await popover.onWillDismiss();

    if (role === 'select' && data) {
      switch(data.action) {
        case 'copyCode':
          await this.copyClassCode();
          break;
        case 'viewInfo':
          await this.viewClassInfo();
          break;
        case 'editClass':
          await this.editClass();
          break;
        case 'deleteClass':
          await this.confirmDeleteClass();
          break;
        case 'leaveClass':
          await this.confirmLeaveClass();
          break;
      }
    }
  }

  private async copyClassCode() {
    if (!this.classData?.classCode) return;

    try {
      await navigator.clipboard.writeText(this.classData.classCode);
      const toast = await this.toastCtrl.create({
        message: 'Class code copied to clipboard!',
        duration: 2000,
        position: 'bottom',
        color: 'primary'
      });
      await toast.present();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  private async viewClassInfo() {
    const alert = await this.alertCtrl.create({
      header: 'Class Information',
      message: `
        <strong>Class Name:</strong> ${this.classData?.title}<br>
        <strong>Section:</strong> ${this.classData?.subtitle}<br>
        <strong>Instructor:</strong> ${this.classData?.name}<br>
        <strong>Class Code:</strong> ${this.classData?.classCode}<br>
        <strong>Members:</strong> ${this.memberCount}<br>
        <strong>Created:</strong> ${this.classData?.createdAt.toLocaleDateString()}
      `,
      buttons: ['Close']
    });

    await alert.present();
  }

  private async editClass() {
    // TODO: Open edit class modal
    const toast = await this.toastCtrl.create({
      message: 'Edit class feature coming soon',
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }

  private async confirmDeleteClass() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Class',
      message: 'Are you sure you want to delete this class? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteClass();
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteClass() {
    this.classService.deleteClass(this.classId);
    
    const toast = await this.toastCtrl.create({
      message: 'Class deleted successfully',
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();

    this.router.navigate(['/classes']);
  }

  private async confirmLeaveClass() {
    const alert = await this.alertCtrl.create({
      header: 'Leave Class',
      message: 'Are you sure you want to leave this class?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Leave',
          role: 'destructive',
          handler: () => {
            this.leaveClass();
          }
        }
      ]
    });

    await alert.present();
  }

  private async leaveClass() {
    const success = this.classService.leaveClass(this.classId);
    
    if (success) {
      const toast = await this.toastCtrl.create({
        message: 'You have left the class',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/classes']);
    }
  }
}