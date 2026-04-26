// src/app/types/activity.types.ts
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
  attachments?: Attachment[];
  classId?: string;
}

export interface Announcement extends BaseActivity {
  type: 'announcement';
}

export interface Assignment extends BaseActivity {
  type: 'assignment';
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded' | 'missing' | 'late';
  grade?: number;
  totalPoints: number;
}

export type Activity = Announcement | Assignment;