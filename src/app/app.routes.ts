import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'study/:id',
        loadComponent: () => import('./study/study.page').then(m => m.StudyPage)
      },
      {
        path: 'activity',
        loadComponent: () => import('./activity/activity.page').then(m => m.ActivityPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage)
      }
    ]
  },
  {
    path: 'study/:id',
    loadComponent: () => import('./study/study.page').then(m => m.StudyPage)
  }
];