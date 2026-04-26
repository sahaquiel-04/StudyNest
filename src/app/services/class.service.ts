import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// User role in a specific class
export type UserRole = 'teacher' | 'student' | 'both';

// Student/Teacher member information
export interface ClassMember {
  userId: string;
  name: string;
  avatar: string;
  joinedAt: Date;
}

// Activity types
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
}

export interface Announcement extends BaseActivity {
  type: 'announcement';
}

export interface Assignment extends BaseActivity {
  type: 'assignment';
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded' | 'missing' | 'late';
  points?: number;
  totalPoints?: number;
  hasSubmission?: boolean;
}

export type Activity = Announcement | Assignment;

// Material type
export interface Material {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: Date;
  url: string;
}

export interface Class {
  id: string;
  title: string;
  subtitle: string;
  name: string;
  avatar: string;
  content: string;
  classCode: string;
  createdAt: Date;
  
  // Teacher information
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  
  // Student list
  students: ClassMember[];
  
  // Activities (announcements and assignments)
  activities?: Activity[];
  
  // Materials
  materials?: Material[];
}

// Extended class with user's role
export interface ClassWithRole extends Class {
  userRole: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly STORAGE_KEY = 'studynest_classes';
  private readonly USER_ID_KEY = 'studynest_current_user_id';
  
  private classesSubject = new BehaviorSubject<Class[]>(this.loadFromStorage());
  classes$: Observable<Class[]> = this.classesSubject.asObservable();
  
  // Observable that includes user roles
  classesWithRoles$: Observable<ClassWithRole[]> = this.classes$.pipe(
    map(classes => classes.map(c => this.addUserRole(c)))
  );

  constructor() {
    // Subscribe to changes and save to storage
    this.classes$.subscribe(classes => {
      this.saveToStorage(classes);
    });
    
    // Initialize user ID if not exists
    this.initializeUserId();
  }

  // Get or create a unique user ID
  private initializeUserId(): void {
    if (!localStorage.getItem(this.USER_ID_KEY)) {
      const userId = this.generateId();
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
  }

  getCurrentUserId(): string {
    return localStorage.getItem(this.USER_ID_KEY) || this.generateId();
  }

  // Add user role to a class
  private addUserRole(classData: Class): ClassWithRole {
    const userId = this.getCurrentUserId();
    let userRole: UserRole;
    
    const isTeacher = classData.teacherId === userId;
    const isStudent = classData.students.some(s => s.userId === userId);
    
    if (isTeacher && isStudent) {
      userRole = 'both';
    } else if (isTeacher) {
      userRole = 'teacher';
    } else {
      userRole = 'student';
    }
    
    return { ...classData, userRole };
  }

  // Get classes where user is a teacher
  getTeacherClasses(): Observable<ClassWithRole[]> {
    return this.classesWithRoles$.pipe(
      map(classes => classes.filter(c => c.userRole === 'teacher' || c.userRole === 'both'))
    );
  }

  // Get classes where user is a student
  getStudentClasses(): Observable<ClassWithRole[]> {
    return this.classesWithRoles$.pipe(
      map(classes => classes.filter(c => c.userRole === 'student' || c.userRole === 'both'))
    );
  }

  private loadFromStorage(): Class[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          students: c.students.map((s: any) => ({
            ...s,
            joinedAt: new Date(s.joinedAt)
          })),
          activities: c.activities?.map((a: any) => ({
            ...a,
            date: new Date(a.date),
            dueDate: a.dueDate ? new Date(a.dueDate) : undefined,
            comments: a.comments?.map((com: any) => ({
              ...com,
              date: new Date(com.date)
            }))
          })) || [],
          materials: c.materials?.map((m: any) => ({
            ...m,
            uploadDate: new Date(m.uploadDate)
          })) || []
        }));
      }
    } catch (error) {
      console.error('Error loading classes from storage:', error);
    }
    return [];
  }

  private saveToStorage(classes: Class[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(classes));
    } catch (error) {
      console.error('Error saving classes to storage:', error);
    }
  }

  getClasses(): Class[] {
    return this.classesSubject.value;
  }

  getClassByCode(code: string): Class | undefined {
    return this.classesSubject.value.find(c => c.classCode === code);
  }

  getClassById(id: string): Class | undefined {
    return this.classesSubject.value.find(c => c.id === id);
  }

  createClass(classData: Partial<Class>): Class {
    const userId = this.getCurrentUserId();
    const userName = classData.teacherName || 'Teacher';
    const userAvatar = classData.teacherAvatar || 'assets/profile.svg';
    
    const newClass: Class = {
      id: this.generateId(),
      title: classData.title || '',
      subtitle: classData.subtitle || '',
      name: classData.name || '',
      avatar: classData.avatar || 'assets/profile.svg',
      content: classData.content || 'Welcome to the class!',
      classCode: this.generateClassCode(),
      createdAt: new Date(),
      teacherId: userId,
      teacherName: userName,
      teacherAvatar: userAvatar,
      students: [],
      activities: [],
      materials: []
    };

    const currentClasses = this.classesSubject.value;
    this.classesSubject.next([...currentClasses, newClass]);
    return newClass;
  }

  joinClass(classCode: string, studentName?: string, studentAvatar?: string): boolean {
    const classToJoin = this.getClassByCode(classCode);
    if (!classToJoin) {
      return false;
    }

    const userId = this.getCurrentUserId();
    
    // Check if user is already a student
    const alreadyStudent = classToJoin.students.some(s => s.userId === userId);
    if (alreadyStudent) {
      console.log('User is already enrolled in this class');
      return true;
    }

    // Add user as a student
    const newStudent: ClassMember = {
      userId: userId,
      name: studentName || 'Student',
      avatar: studentAvatar || 'assets/profile.svg',
      joinedAt: new Date()
    };

    classToJoin.students.push(newStudent);
    this.classesSubject.next([...this.classesSubject.value]);
    return true;
  }

  // Activity Methods
  addActivity(classId: string, activity: Omit<Activity, 'id'>): Activity | null {
    const classData = this.getClassById(classId);
    if (!classData) return null;

    const newActivity: Activity = {
      ...activity,
      id: this.generateId()
    } as Activity;

    if (!classData.activities) {
      classData.activities = [];
    }

    classData.activities.unshift(newActivity); // Add to beginning
    this.classesSubject.next([...this.classesSubject.value]);
    return newActivity;
  }

  getActivities(classId: string): Activity[] {
    const classData = this.getClassById(classId);
    return classData?.activities || [];
  }

  // NEW METHOD: Update activity status (for assignments)
  updateActivityStatus(
    classId: string, 
    activityId: string, 
    status: Assignment['status']
  ): boolean {
    const classData = this.getClassById(classId);
    if (!classData) return false;

    const activity = classData.activities?.find(a => a.id === activityId);
    if (!activity || activity.type !== 'assignment') return false;

    // Update the status
    (activity as Assignment).status = status;
    
    // Trigger update
    this.classesSubject.next([...this.classesSubject.value]);
    return true;
  }

  addComment(classId: string, activityId: string, comment: Comment): boolean {
    const classData = this.getClassById(classId);
    if (!classData) return false;

    const activity = classData.activities?.find(a => a.id === activityId);
    if (!activity) return false;

    if (!activity.comments) {
      activity.comments = [];
    }

    activity.comments.push(comment);
    this.classesSubject.next([...this.classesSubject.value]);
    return true;
  }

  // Material Methods
  addMaterial(classId: string, material: Omit<Material, 'id'>): Material | null {
    const classData = this.getClassById(classId);
    if (!classData) return null;

    const newMaterial: Material = {
      ...material,
      id: this.generateId()
    };

    if (!classData.materials) {
      classData.materials = [];
    }

    classData.materials.unshift(newMaterial);
    this.classesSubject.next([...this.classesSubject.value]);
    return newMaterial;
  }

  getMaterials(classId: string): Material[] {
    const classData = this.getClassById(classId);
    return classData?.materials || [];
  }

  // Check if current user has a specific role in a class
  hasRole(classId: string, role: UserRole): boolean {
    const classData = this.getClassById(classId);
    if (!classData) return false;
    
    const classWithRole = this.addUserRole(classData);
    
    if (role === 'both') {
      return classWithRole.userRole === 'both';
    } else if (role === 'teacher') {
      return classWithRole.userRole === 'teacher' || classWithRole.userRole === 'both';
    } else {
      return classWithRole.userRole === 'student' || classWithRole.userRole === 'both';
    }
  }

  // Get member count (students only, or including teacher)
  getMemberCount(classId: string, includeTeacher: boolean = true): number {
    const classData = this.getClassById(classId);
    if (!classData) return 0;
    
    return classData.students.length + (includeTeacher ? 1 : 0);
  }

  deleteClass(classId: string): void {
    const currentClasses = this.classesSubject.value;
    const updatedClasses = currentClasses.filter(c => c.id !== classId);
    this.classesSubject.next(updatedClasses);
  }

  leaveClass(classId: string): boolean {
    const classData = this.getClassById(classId);
    if (!classData) return false;

    const userId = this.getCurrentUserId();
    
    // Remove user from students list
    classData.students = classData.students.filter(s => s.userId !== userId);
    
    this.classesSubject.next([...this.classesSubject.value]);
    return true;
  }

  updateClass(classId: string, updates: Partial<Class>): void {
    const currentClasses = this.classesSubject.value;
    const classIndex = currentClasses.findIndex(c => c.id === classId);
    
    if (classIndex !== -1) {
      currentClasses[classIndex] = {
        ...currentClasses[classIndex],
        ...updates
      };
      this.classesSubject.next([...currentClasses]);
    }
  }

  clearAllClasses(): void {
    this.classesSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateClassCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (this.getClassByCode(code)) {
      return this.generateClassCode();
    }
    return code;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}