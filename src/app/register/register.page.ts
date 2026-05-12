import { Component } from '@angular/core';
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
import { mail, lockClosed, eye, eyeOff, logoGoogle, logoFacebook, person } from 'ionicons/icons';
import { FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonIcon, IonLabel, IonText]
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private flashcardService: FlashcardService
  ) {
    addIcons({ mail, lockClosed, eye, eyeOff, logoGoogle, logoFacebook, person });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Passwords do not match', 'danger');
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showToast('Please enter a valid email address', 'warning');
      return;
    }

    let users = [];
    const existingUsers = localStorage.getItem('memoflip_users');
    if (existingUsers) {
      users = JSON.parse(existingUsers);
    }
    
    if (users.find((u: any) => u.email === this.email)) {
      await this.showToast('Email already registered. Please login.', 'danger');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: this.name,
      email: this.email,
      password: this.password,
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('memoflip_users', JSON.stringify(users));
    
    await this.showToast('Account created successfully! Please login.', 'success');
    this.router.navigate(['/login']);
  }

  async googleSignUp() {
    // Google user info
    const googleUser = {
      id: 'google_' + Date.now(),
      name: 'Gladys Miranda',
      email: 'gladys.miranda@gmail.com',
      password: 'google_auth_' + Date.now(),
      provider: 'google',
      avatar: 'https://ui-avatars.com/api/?name=Gladys+Miranda&background=667eea&color=fff',
      createdAt: new Date().toISOString()
    };
    
    // Save or get existing user
    let users = [];
    const existingUsers = localStorage.getItem('memoflip_users');
    if (existingUsers) {
      users = JSON.parse(existingUsers);
    }
    
    // Check if Google user already exists
    let existingUser = users.find((u: any) => u.email === googleUser.email && u.provider === 'google');
    
    if (!existingUser) {
      // Add new Google user
      users.push(googleUser);
      localStorage.setItem('memoflip_users', JSON.stringify(users));
      existingUser = googleUser;
    }
    
    // Set as current user and login
    localStorage.setItem('memoflip_currentUser', JSON.stringify(existingUser));
    this.flashcardService.setCurrentUser(existingUser);
    
    await this.showToast('Welcome, Gladys Miranda! 🎉', 'success');
    this.router.navigate(['/tabs/home']);
  }

  async facebookSignUp() {
    // Facebook user info
    const facebookUser = {
      id: 'facebook_' + Date.now(),
      name: 'Gladys Miranda',
      email: 'gladys.miranda@facebook.com',
      password: 'fb_auth_' + Date.now(),
      provider: 'facebook',
      avatar: 'https://ui-avatars.com/api/?name=Gladys+Miranda&background=4267B2&color=fff',
      createdAt: new Date().toISOString()
    };
    
    // Save or get existing user
    let users = [];
    const existingUsers = localStorage.getItem('memoflip_users');
    if (existingUsers) {
      users = JSON.parse(existingUsers);
    }
    
    // Check if Facebook user already exists
    let existingUser = users.find((u: any) => u.email === facebookUser.email && u.provider === 'facebook');
    
    if (!existingUser) {
      // Add new Facebook user
      users.push(facebookUser);
      localStorage.setItem('memoflip_users', JSON.stringify(users));
      existingUser = facebookUser;
    }
    
    // Set as current user and login
    localStorage.setItem('memoflip_currentUser', JSON.stringify(existingUser));
    this.flashcardService.setCurrentUser(existingUser);
    
    await this.showToast('Welcome, Gladys Miranda! 🎉', 'success');
    this.router.navigate(['/tabs/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}