import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, 
  IonIcon, IonBadge, IonCard, IonCardContent, IonCardHeader, IonItem, 
  IonAvatar, IonLabel, IonInput, IonCardTitle, IonChip, IonCardSubtitle,
  ActionSheetController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  newspaperOutline,
  ellipsisVertical,
  calendarOutline,
  documentOutline,
  downloadOutline,
  send,
  flagOutline,
  megaphoneOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { ActivityCardComponent, Activity as CardActivity, Comment, Attachment } from '../components/activity-card/activity-card.component';
import { StatsOverviewComponent, StatsData } from '../components/stats-overview/stats-overview.component';


interface Subject {
  title: string;
  completed: number;
  total: number;
  classId?: string;
}

interface GroupedActivities {
  className: string;
  classId?: string;
  activities: CardActivity[];
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonAvatar,
    IonLabel,
    IonInput,
    IonCardTitle,
    IonChip,
    IonCardSubtitle,
    ActivityCardComponent,
    StatsOverviewComponent,
  ],
})
export class Tab1Page implements OnInit {

  stats: StatsData = {
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    overdueAssignments: 0,
    totalClasses: 0,
    streak: 5,
  };
  
  subjects: Subject[] = [
    {
      title: 'Software Engineering',
      completed: 2,
      total: 5,
      classId: '1'
    },
    {
      title: 'Fundamentals in Data Science',
      completed: 1,
      total: 3,
      classId: '2'
    },
    {
      title: 'Automata Theory',
      completed: 0,
      total: 4,
      classId: '3'
    }
  ];

  activities: CardActivity[] = [
    {
      id: '1',
      type: 'assignment',
      title: 'Design Document Submission',
      description: 'Submit your software design document including UML diagrams and architecture.',
      author: 'John Pork',
      authorAvatar: 'assets/johnpork.png',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      status: 'pending',
      attachments: [
        {
          id: '1',
          name: 'Chapter3_Notes.pdf',
          size: '2.1 MB',
          type: 'PDF Document',
          url: '#'
        }
      ],
      comments: [
        {
          author: 'Alice Smith',
          authorAvatar: 'assets/profile.svg',
          text: 'Can we submit this in groups?',
          date: new Date(Date.now() - 1000 * 60 * 30)
        }
      ],
      className: 'Software Engineering',
      classId: '1'
    },
    {
      id: '2',
      type: 'announcement',
      title: 'Class Rescheduled',
      description: 'Tomorrow\'s class has been moved to 2:00 PM. Please adjust your schedules accordingly.',
      author: 'Charlie Kirk',
      authorAvatar: 'assets/images.jpg',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5),
      comments: [],
      className: 'Automata Theory',
      classId: '3'
    },
    {
      id: '3',
      type: 'announcement',
      title: 'Week 5 Lecture Slides',
      description: 'Find attached the lecture slides for this week covering Linear Regression.',
      author: 'Dr. Smith',
      authorAvatar: 'assets/profile.svg',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      attachments: [
        {
          id: '2',
          name: 'Week5_LinearRegression.pdf',
          size: '3.5 MB',
          type: 'PDF Document',
          url: '#'
        }
      ],
      comments: [],
      className: 'Fundamentals in Data Science',
      classId: '2'
    },
    {
      id: '4',
      type: 'assignment',
      title: 'Lab Exercise 3',
      description: 'Complete the finite automata exercises from chapter 4.',
      author: 'Charlie Kirk',
      authorAvatar: 'assets/images.jpg',
      date: new Date(Date.now() - 1000 * 60 * 60 * 3),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      status: 'pending',
      comments: [],
      className: 'Automata Theory',
      classId: '3'
    }
  ];

  groupedActivities: GroupedActivities[] = [];

  currentUser = {
    name: 'Current User',
    avatar: 'assets/profile.svg'
  };

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      newspaperOutline,
      ellipsisVertical,
      calendarOutline,
      documentOutline,
      downloadOutline,
      send,
      flagOutline,
      megaphoneOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit() {
    this.groupActivitiesByClass();
  }

  groupActivitiesByClass() {
    const grouped = new Map<string, CardActivity[]>();
    
    this.activities.forEach(activity => {
      const className = (activity as any).className || 'Other';
      if (!grouped.has(className)) {
        grouped.set(className, []);
      }
      grouped.get(className)!.push(activity);
    });

    this.groupedActivities = Array.from(grouped.entries()).map(([className, activities]) => ({
      className,
      classId: (activities[0] as any).classId,
      activities
    }));
  }

  getTasksArray(total: number) {
    return Array(total).fill(0);
  }

  openClassDetails(classId?: string) {
    if (classId) {
      this.router.navigate(['/class', classId]);
    }
  }

  onCommentAdded(event: { activity: CardActivity, comment: Comment }) {
    console.log('Comment added:', event);
  }

  onTurnIn(assignment: any) {
    console.log('Turn in assignment:', assignment);
  }

  onAttachmentClick(attachment: Attachment) {
    console.log('Download attachment:', attachment);
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  openNotifications() {
    console.log('Open notifications page or modal');
  }
}