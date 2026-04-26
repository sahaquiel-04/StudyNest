import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonRouterOutlet,
  IonMenuButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonFab,
  IonFabButton,
  IonFabList,
  ModalController,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  peopleOutline, 
  createOutline, 
  documentTextOutline 
} from 'ionicons/icons';
import { ClassService } from '../services/class.service';
import { CreateClassModalComponent } from '../components/create-class-modal/create-class-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonRouterOutlet,
    IonMenuButton,
    IonSearchbar,
    IonList,
    IonItem,
    IonFab,
    IonFabButton,
    IonFabList,
  ],
})
export class TabsPage {
  notificationCount = 3;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private classService: ClassService,
    private toastCtrl: ToastController
  ) {
    // Register icons for FAB list
    addIcons({ peopleOutline, createOutline, documentTextOutline });
  }

  openNotifications() {
    console.log('Open notifications page or modal');
  }

  searchText = '';
  classes = ['Math', 'Science', 'History', 'English'];
  filteredClasses: string[] = [];
  showSearchBar = false;

  onSearchInput() {
    const query = this.searchText.toLowerCase();
    if (query) {
      this.filteredClasses = this.classes.filter(c =>
        c.toLowerCase().includes(query)
      );
    } else {
      this.filteredClasses = [];
    }
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchText = '';
      this.filteredClasses = [...this.classes];
    }
  }

  // FAB List Actions
  
  async joinClass() {
  const alert = await this.alertCtrl.create({
    header: 'Join Class',
    message: 'Enter the 6-digit class code provided by your instructor',
    inputs: [
      {
        name: 'classCode',
        type: 'text',
        placeholder: 'ABC123',
        attributes: {
          maxlength: 6,
          inputmode: 'text',
          autocapitalize: 'characters',
          autocorrect: 'off',
          spellcheck: 'false'
        }
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-button-cancel'
      },
      {
        text: 'Join',
        cssClass: 'alert-button-confirm',
        handler: async (data) => {
          const classCode = data.classCode?.trim().toUpperCase();
          
          // Validate class code
          if (!classCode) {
            this.showToast('Please enter a class code', 'warning');
            return false; // Keep alert open
          }
          
          if (classCode.length !== 6) {
            this.showToast('Class code must be 6 characters', 'warning');
            return false; // Keep alert open
          }
          
          // Check if code contains only alphanumeric characters
          if (!/^[A-Z0-9]{6}$/.test(classCode)) {
            this.showToast('Class code must contain only letters and numbers', 'warning');
            return false; // Keep alert open
          }
          
          // Attempt to join class
          const success = this.classService.joinClass(classCode);
          
          if (success) {
            this.showToast('Successfully joined the class! 🎉', 'success');
            return true; // Close alert
          } else {
            this.showToast('Invalid class code. Please check and try again.', 'danger');
            return false; // Keep alert open to try again
          }
        }
      }
    ]
  });

  await alert.present();
  
  // Optional: Focus on input when alert opens
  const firstInput: any = await alert.querySelector('input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 250);
  }
}

// Helper method for showing toasts
private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
  const toast = await this.toastCtrl.create({
    message: message,
    duration: 2500,
    position: 'top',
    color: color,
    buttons: [
      {
        text: 'Dismiss',
        role: 'cancel'
      }
    ]
  });
  await toast.present();
}

  async createClass() {
    const modal = await this.modalCtrl.create({
      component: CreateClassModalComponent,
      cssClass: 'create-class-modal'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'created' && data) {
      console.log('Class created from tabs:', data);
      // Optionally navigate to the Classes tab
      // this.router.navigate(['/tabs/tab2']);
    }
  }

  createPost() {
    console.log('Navigate to create post page');
    // TODO: Navigate to create post modal/page
    // Example: this.router.navigate(['/create-post']);
  }
}