import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonRow,
  IonButton, IonButtons, IonCol, IonIcon, IonCard, IonCardContent, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonPopover, IonLabel,
  IonMenuButton,
  ModalController, AlertController, ToastController
} from '@ionic/angular/standalone';
import { AppBottomNavComponent } from '../components/app-bottom-nav/app-bottom-nav.component';
import { ActionSheetController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  schoolOutline, 
  addOutline, 
  createOutline, 
  closeOutline,
  eyeOutline,
  exitOutline,
  trashOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ClassService, Class } from '../services/class.service';
import { CreateClassModalComponent } from '../components/create-class-modal/create-class-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    FormsModule,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRow,
    IonButton,
    IonButtons,
    IonCol,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonPopover,
    IonLabel,
    IonMenuButton,
    AppBottomNavComponent,
  ],
})
export class Tab2Page implements OnInit, OnDestroy {
  classes: Class[] = [];
  popoverOpen = false;
  popoverEvent: any;
  selectedIndex: number | null = null;
  private classesSubscription?: Subscription;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private classService: ClassService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    addIcons({ 
      schoolOutline, 
      addOutline, 
      createOutline, 
      closeOutline,
      eyeOutline,
      exitOutline,
      trashOutline
    });
  }

  ngOnInit() {
    // Subscribe to classes from the service
    this.classesSubscription = this.classService.classes$.subscribe(
      classes => {
        this.classes = classes;
      }
    );
  }

  ngOnDestroy() {
    if (this.classesSubscription) {
      this.classesSubscription.unsubscribe();
    }
  }

  // Navigate to class interface when card is clicked
  navigateToClass(classId: string) {
    this.router.navigate(['/class', classId]);
  }

  async addItem() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an option',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Join Class',
          icon: 'add-outline',
          handler: () => {
            this.joinClass();
          }
        },
        {
          text: 'Create Class',
          icon: 'create-outline',
          handler: () => {
            this.openCreateClassModal();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-outline'
        }
      ]
    });

    await actionSheet.present();
  }

  async openCreateClassModal() {
    const modal = await this.modalCtrl.create({
      component: CreateClassModalComponent,
      cssClass: 'create-class-modal'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'created' && data) {
      console.log('Class created:', data);
    }
  }

  async joinClass() {
    const alert = await this.alertCtrl.create({
      header: 'Join Class',
      message: 'Enter the class code to join',
      inputs: [
        {
          name: 'classCode',
          type: 'text',
          placeholder: 'Enter 6-digit code',
          attributes: {
            maxlength: 6,
            style: 'text-transform: uppercase'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Join',
          handler: async (data) => {
            if (data.classCode) {
              const success = this.classService.joinClass(data.classCode.toUpperCase());
              
              if (success) {
                const toast = await this.toastCtrl.create({
                  message: 'Successfully joined the class!',
                  duration: 2000,
                  position: 'top',
                  color: 'success'
                });
                await toast.present();
              } else {
                const toast = await this.toastCtrl.create({
                  message: 'Invalid class code. Please try again.',
                  duration: 2000,
                  position: 'top',
                  color: 'danger'
                });
                await toast.present();
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  openPopover(ev: any, index: number) {
    this.popoverEvent = ev; 
    this.selectedIndex = index;
    this.popoverOpen = true;
  }

  viewClassDetails() {
    if (this.selectedIndex !== null) {
      const selectedClass = this.classes[this.selectedIndex];
      this.router.navigate(['/class', selectedClass.id]);
    }
    this.popoverOpen = false;
  }

  async showClassCode() {
    if (this.selectedIndex !== null) {
      const selectedClass = this.classes[this.selectedIndex];
      
      const alert = await this.alertCtrl.create({
        header: 'Class Code',
        message: `Share this code with students to join:<br><br><strong style="font-size: 24px; letter-spacing: 2px;">${selectedClass.classCode}</strong>`,
        buttons: [
          {
            text: 'Copy Code',
            handler: async () => {
              await navigator.clipboard.writeText(selectedClass.classCode);
              const toast = await this.toastCtrl.create({
                message: 'Class code copied!',
                duration: 2000,
                position: 'bottom',
                color: 'success'
              });
              await toast.present();
            }
          },
          {
            text: 'Close',
            role: 'cancel'
          }
        ]
      });

      await alert.present();
    }
    this.popoverOpen = false;
  }

  editClass() {
    if (this.selectedIndex !== null) {
      console.log('Edit class:', this.classes[this.selectedIndex]);
      // TODO: Open edit modal
    }
    this.popoverOpen = false;
  }

  async leaveClass() {
    if (this.selectedIndex === null) return;

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
            console.log('Left class');
            this.popoverOpen = false;
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteClass(index: number | null) {
    if (index === null) return;

    const classToDelete = this.classes[index];

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
            this.classService.deleteClass(classToDelete.id);
            const toast = this.toastCtrl.create({
              message: 'Class deleted successfully',
              duration: 2000,
              position: 'bottom',
              color: 'success'
            });
          }
        }
      ]
    });

    this.popoverOpen = false;
    await alert.present();
  }
}