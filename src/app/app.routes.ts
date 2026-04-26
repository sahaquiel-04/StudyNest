

// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',  // <-- this makes landing the first page
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'class/:id',  // Changed to accept class ID
    loadComponent: () => import('./interface/class.interface/class.interface.page').then( m => m.ClassInterfacePage)
  },
  {
    path: 'item.interface',
    loadComponent: () => import('./interface/item.interface/item.interface.page').then( m => m.ItemInterfacePage)
  },
  {
  path: 'interface/class-interface/:id/activity/:activityId',
  loadComponent: () => 
    import('./interface/activity-detail/activity-detail.page').then(m => m.ActivityDetailPage)
},
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'announcement-detail',
    loadComponent: () => import('./interface/announcement-detail/announcement-detail.page').then( m => m.AnnouncementDetailPage)
  },
  {
  path: 'chat/:id',   // ← add /:id
  loadComponent: () =>
    import('./interface/chat/chat.page').then(m => m.ChatPage),
},
];

