import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonFooter,
  IonTextarea,
  IonAvatar,
  IonBadge,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  callOutline,
  videocamOutline,
  ellipsisVerticalOutline,
  sendOutline,
  attachOutline,
  happyOutline,
  checkmarkOutline,
  checkmarkDoneOutline,
  micOutline,
  imageOutline,
} from 'ionicons/icons';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image';
  replyTo?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonFooter,
    IonTextarea,
    IonAvatar,
    IonBadge,
    IonSpinner,
  ],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('messageInput') messageInput!: ElementRef;

  chatId = '';
  chatName = 'Charlie Kirk';
  chatAvatar = 'assets/images.jpg';
  isOnline = true;
  isTyping = false;
  messageText = '';
  isGroupChat = false;
  currentUserId = 'me';

  messages: Message[] = [
    {
      id: '1',
      text: 'Hey! Did you finish the lab report for tomorrow?',
      senderId: 'charlie',
      senderName: 'Charlie Kirk',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      text: 'Not yet 😅 still working on the conclusion part. You?',
      senderId: 'me',
      senderName: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      text: 'Same! The data analysis section is giving me a hard time. Do you think we need to include all the trial runs?',
      senderId: 'charlie',
      senderName: 'Charlie Kirk',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      status: 'read',
      type: 'text',
    },
    {
      id: '4',
      text: 'I think just the averaged results should be fine. Prof mentioned we should focus on the error margin.',
      senderId: 'me',
      senderName: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 23),
      status: 'read',
      type: 'text',
    },
    {
      id: '5',
      text: 'Oh right! That makes it way easier. Thanks for the tip 👍',
      senderId: 'charlie',
      senderName: 'Charlie Kirk',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      status: 'read',
      type: 'text',
    },
    {
      id: '6',
      text: "Don't forget about the assignment due tomorrow!",
      senderId: 'charlie',
      senderName: 'Charlie Kirk',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'read',
      type: 'text',
    },
  ];

  private typingTimeout: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    addIcons({
      arrowBackOutline,
      callOutline,
      videocamOutline,
      ellipsisVerticalOutline,
      sendOutline,
      attachOutline,
      happyOutline,
      checkmarkOutline,
      checkmarkDoneOutline,
      micOutline,
      imageOutline,
    });
  }

  ngOnInit() {
  this.chatId = this.route.snapshot.paramMap.get('id') || '';

  const nav = this.router.getCurrentNavigation();
  const state = nav?.extras?.state;
  if (state) {
    this.chatName    = state['name']   || this.chatName;
    this.chatAvatar  = state['avatar'] || this.chatAvatar;
    this.isOnline    = state['online'] ?? true;
    this.isGroupChat = state['type'] === 'group';
  }

  this.scrollToBottom();
}

  ngOnDestroy() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab3']);
  }

  sendMessage() {
    const text = this.messageText.trim();
    if (!text) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: 'me',
      senderName: 'You',
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    this.messages.push(newMessage);
    this.messageText = '';
    this.scrollToBottom();

    // Simulate message sent
    setTimeout(() => {
      newMessage.status = 'delivered';
    }, 800);

    // Simulate other person typing and replying
    setTimeout(() => {
      this.isTyping = true;
      this.scrollToBottom();
    }, 1500);

    setTimeout(() => {
      this.isTyping = false;
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: this.getAutoReply(text),
        senderId: 'charlie',
        senderName: 'Charlie Kirk',
        timestamp: new Date(),
        status: 'sent',
        type: 'text',
      };
      this.messages.push(reply);
      newMessage.status = 'read';
      this.scrollToBottom();
    }, 3500);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onTextChange() {
    // Could emit typing indicator to server here
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content?.scrollToBottom(300);
    }, 100);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDateLabel(date: Date): string {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }

  shouldShowDateLabel(index: number): boolean {
    if (index === 0) return true;
    const prev = this.messages[index - 1];
    const curr = this.messages[index];
    const prevDate = new Date(prev.timestamp);
    const currDate = new Date(curr.timestamp);
    return prevDate.toDateString() !== currDate.toDateString();
  }

  shouldShowAvatar(index: number): boolean {
    const curr = this.messages[index];
    if (curr.senderId === 'me') return false;
    const next = this.messages[index + 1];
    if (!next || next.senderId !== curr.senderId) return true;
    return false;
  }

  shouldShowName(index: number): boolean {
    if (!this.isGroupChat) return false;
    const curr = this.messages[index];
    if (curr.senderId === 'me') return false;
    if (index === 0) return true;
    const prev = this.messages[index - 1];
    return prev.senderId !== curr.senderId;
  }

  isConsecutive(index: number): boolean {
    if (index === 0) return false;
    const curr = this.messages[index];
    const prev = this.messages[index - 1];
    if (curr.senderId !== prev.senderId) return false;
    const timeDiff =
      new Date(curr.timestamp).getTime() -
      new Date(prev.timestamp).getTime();
    return timeDiff < 1000 * 60 * 5; // within 5 minutes
  }

  private getAutoReply(text: string): string {
    const replies = [
      "That's a good point!",
      'Got it, thanks!',
      'Sure, sounds good 👍',
      "I'll check that out.",
      'Yeah, same here!',
      'Okay, noted!',
      "Let me know how it goes!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  get canSend(): boolean {
    return this.messageText.trim().length > 0;
  }
}