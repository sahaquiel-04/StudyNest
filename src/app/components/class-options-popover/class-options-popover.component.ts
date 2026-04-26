import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  PopoverController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  copyOutline,
  exitOutline,
  settingsOutline,
  trashOutline,
  pencilOutline,
  informationCircleOutline,
} from 'ionicons/icons';

interface MenuOption {
  label: string;
  icon: string;
  action: string;
  color?: string;
}

@Component({
  selector: 'app-class-options-popover',
  templateUrl: './class-options-popover.component.html',
  styleUrls: ['./class-options-popover.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  ]
})
export class ClassOptionsPopoverComponent implements OnInit {
  @Input() isTeacher: boolean = false;
  @Input() classCode?: string;

  menuOptions: MenuOption[] = [];

  constructor(private popoverCtrl: PopoverController) {
    addIcons({
      copyOutline,
      exitOutline,
      settingsOutline,
      trashOutline,
      pencilOutline,
      informationCircleOutline,
    });
  }

  ngOnInit() {
    this.buildMenuOptions();
  }

  private buildMenuOptions() {
    // Common options for all users
    this.menuOptions = [
      {
        label: 'Class Info',
        icon: 'information-circle-outline',
        action: 'viewInfo'
      },
      {
        label: 'Copy Class Code',
        icon: 'copy-outline',
        action: 'copyCode'
      }
    ];

    // Teacher-specific options
    if (this.isTeacher) {
      this.menuOptions.push(
        {
          label: 'Edit Class',
          icon: 'pencil-outline',
          action: 'editClass'
        },
        {
          label: 'Class Settings',
          icon: 'settings-outline',
          action: 'settings'
        },
        {
          label: 'Delete Class',
          icon: 'trash-outline',
          action: 'deleteClass',
          color: 'danger'
        }
      );
    } else {
      // Student-specific options
      this.menuOptions.push({
        label: 'Leave Class',
        icon: 'exit-outline',
        action: 'leaveClass',
        color: 'danger'
      });
    }
  }

  selectOption(action: string) {
    this.popoverCtrl.dismiss({ action }, 'select');
  }
}