import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonSearchbar,
  IonIcon,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { AppBottomNavComponent } from '../components/app-bottom-nav/app-bottom-nav.component';
import { addIcons } from 'ionicons';
import {
  chatbubblesOutline,
  searchOutline,
  createOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSender: string;
  lastMessageRead: boolean;
  unread: number;
  online: boolean;
  type: 'direct' | 'group';
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonSearchbar,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    AppBottomNavComponent,
  ],
})
export class Tab3Page implements OnInit {
  searchText = '';
  chats: Chat[] = [
    {
      id: '1',
      name: 'Charlie Kirk',
      avatar: 'assets/images.jpg',
      lastMessage: 'Don\'t forget about the assignment due tomorrow!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      lastMessageSender: 'Charlie Kirk',
      lastMessageRead: true,
      unread: 2,
      online: true,
      type: 'direct'
    },
    {
      id: '2',
      name: 'John Pork',
      avatar: 'assets/johnpork.png',
      lastMessage: 'Thanks for the notes!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      lastMessageSender: 'You',
      lastMessageRead: true,
      unread: 0,
      online: false,
      type: 'direct'
    },
    {
      id: '3',
      name: 'BSCS-3C Group',
      avatar: 'assets/profile.svg',
      lastMessage: 'Alice: Can someone share the lecture slides?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      lastMessageSender: 'Alice',
      lastMessageRead: false,
      unread: 5,
      online: false,
      type: 'group'
    },
    {
      id: '4',
      name: 'Study Group',
      avatar: 'assets/profile.svg',
      lastMessage: 'You: Let\'s meet at the library tomorrow',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      lastMessageSender: 'You',
      lastMessageRead: true,
      unread: 0,
      online: false,
      type: 'group'
    },
    {
      id: '5',
      name: 'Jane Smith',
      avatar: 'assets/profile.svg',
      lastMessage: 'See you in class!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      lastMessageSender: 'Jane Smith',
      lastMessageRead: true,
      unread: 0,
      online: true,
      type: 'direct'
    }
  ];

  filteredChats: Chat[] = [];

  constructor(private router: Router) {
    addIcons({
      chatbubblesOutline,
      searchOutline,
      createOutline,
      checkmarkDoneOutline,
    });
  }

  ngOnInit() {
    this.filteredChats = [...this.chats];
  }

  filterChats() {
    const query = this.searchText.toLowerCase().trim();
    
    if (!query) {
      this.filteredChats = [...this.chats];
      return;
    }

    this.filteredChats = this.chats.filter(chat =>
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    );
  }

  openChat(chat: Chat) {
  this.router.navigate(['/chat', chat.id], {  // ← make sure the / is there
    state: {
      name: chat.name,
      avatar: chat.avatar,
      online: chat.online,
      type: chat.type,
    },
  });
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
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  get totalUnreadCount(): number {
    return this.chats.reduce((sum, chat) => sum + chat.unread, 0);
  }
}