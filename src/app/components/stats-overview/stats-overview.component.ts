import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonChip,
  IonLabel,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  timeOutline,
  alertCircleOutline,
  trophyOutline,
  bookOutline,
  flameOutline,
} from 'ionicons/icons';

export interface StatsData {
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  overdueAssignments: number;
  totalClasses: number;
  streak?: number;
}

@Component({
  selector: 'app-stats-overview',
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonIcon,
    IonChip,
    IonLabel,
    IonTitle,
  ]
})
export class StatsOverviewComponent {
  @Input() stats: StatsData = {
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    overdueAssignments: 0,
    totalClasses: 0,
    streak: 0,
  };

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      timeOutline,
      alertCircleOutline,
      trophyOutline,
      bookOutline,
      flameOutline,
    });
  }

  get completionRate(): number {
    if (this.stats.totalAssignments === 0) return 0;
    return Math.round((this.stats.completedAssignments / this.stats.totalAssignments) * 100);
  }

  get progressBarWidth(): string {
    return `${this.completionRate}%`;
  }
}