import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonLabel,
  IonText,
  ToastController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { mail, lockClosed, eye, eyeOff, logoGoogle, logoFacebook } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonIcon, IonLabel, IonText]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ mail, lockClosed, eye, eyeOff, logoGoogle, logoFacebook });
  }

  ngOnInit() {
    this.initializeDemoUsers();
    // Check if user is already logged in
    const currentUser = localStorage.getItem('memoflip_currentUser');
    if (currentUser) {
      this.router.navigate(['/tabs/home']);
    }
  }

  initializeDemoUsers() {
    // Demo users for testing
    const demoUsers = [
      { 
        id: 1, 
        name: 'Demo User', 
        email: 'miranda@memoflip.com', 
        password: 'demo123',
        createdAt: new Date().toISOString()
      },
      { 
        id: 2, 
        name: 'Test User', 
        email: 'user@example.com', 
        password: 'password',
        createdAt: new Date().toISOString()
      },
      { 
        id: 3, 
        name: 'John Doe', 
        email: 'john@example.com', 
        password: 'john123',
        createdAt: new Date().toISOString()
      }
    ];
    
    // Check if users exist in localStorage
    const existingUsers = localStorage.getItem('memoflip_users');
    if (!existingUsers) {
      localStorage.setItem('memoflip_users', JSON.stringify(demoUsers));
      console.log('Demo users initialized');
    } else {
      console.log('Users already exist:', JSON.parse(existingUsers));
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    console.log('Login attempt with:', this.email, this.password);
    
    if (!this.email || !this.password) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    // Get registered users from localStorage
    const usersData = localStorage.getItem('memoflip_users');
    console.log('Users from localStorage:', usersData);
    
    if (!usersData) {
      await this.showToast('No users found. Please register first.', 'danger');
      return;
    }
    
    const users = JSON.parse(usersData);
    console.log('Parsed users:', users);
    
    // Find user by email and password
    const user = users.find((u: any) => u.email === this.email && u.password === this.password);
    console.log('Found user:', user);

    if (user) {
      // Save login session
      localStorage.setItem('memoflip_currentUser', JSON.stringify(user));
      await this.showToast('Welcome back, ' + user.name + '! 🎉', 'success');
      this.router.navigate(['/tabs/home']);
    } else {
      // Check if email exists but password wrong
      const emailExists = users.find((u: any) => u.email === this.email);
      if (emailExists) {
        await this.showToast('Incorrect password. Please try again.', 'danger');
      } else {
        await this.showToast('Account not found. Please sign up first.', 'danger');
      }
    }
  }

  async googleLogin() {
    await this.showToast('Google login coming soon! Use demo account for now.', 'info');
  }

  async facebookLogin() {
    await this.showToast('Facebook login coming soon! Use demo account for now.', 'info');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
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
}