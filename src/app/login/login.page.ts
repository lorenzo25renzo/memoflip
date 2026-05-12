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
import { FlashcardService } from '../services/flashcard.service';

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
    private toastController: ToastController,
    private flashcardService: FlashcardService
  ) {
    addIcons({ mail, lockClosed, eye, eyeOff, logoGoogle, logoFacebook });
  }

  ngOnInit() {
    const currentUser = localStorage.getItem('memoflip_currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.flashcardService.setCurrentUser(user);
      this.router.navigate(['/tabs/home']);
    }
  }

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    const usersData = localStorage.getItem('memoflip_users');
    if (!usersData) {
      await this.showToast('No users found. Please sign up first.', 'danger');
      return;
    }
    
    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === this.email && u.password === this.password);

    if (user) {
      localStorage.setItem('memoflip_currentUser', JSON.stringify(user));
      this.flashcardService.setCurrentUser(user);
      await this.showToast('Welcome back, ' + user.name + '! 🎉', 'success');
      this.router.navigate(['/tabs/home']);
    } else {
      const emailExists = users.find((u: any) => u.email === this.email);
      if (emailExists) {
        await this.showToast('Incorrect password. Please try again.', 'danger');
      } else {
        await this.showToast('Account not found. Please sign up first.', 'danger');
      }
    }
  }

  async googleLogin() {
    const googleUser = {
      id: 'google_' + Date.now(),
      name: 'Gladys Miranda',
      email: 'gladys.miranda@gmail.com',
      password: 'google_auth_' + Date.now(),
      provider: 'google',
      avatar: 'https://ui-avatars.com/api/?name=Gladys+Miranda&background=667eea&color=fff',
      createdAt: new Date().toISOString()
    };
    
    let users = [];
    const existingUsers = localStorage.getItem('memoflip_users');
    if (existingUsers) {
      users = JSON.parse(existingUsers);
    }
    
    let existingUser = users.find((u: any) => u.email === googleUser.email && u.provider === 'google');
    
    if (!existingUser) {
      users.push(googleUser);
      localStorage.setItem('memoflip_users', JSON.stringify(users));
      existingUser = googleUser;
    }
    
    localStorage.setItem('memoflip_currentUser', JSON.stringify(existingUser));
    this.flashcardService.setCurrentUser(existingUser);
    
    await this.showToast('Welcome, Gladys Miranda! 🎉', 'success');
    this.router.navigate(['/tabs/home']);
  }

  async facebookLogin() {
    const facebookUser = {
      id: 'facebook_' + Date.now(),
      name: 'Gladys Miranda',
      email: 'gladys.miranda@facebook.com',
      password: 'fb_auth_' + Date.now(),
      provider: 'facebook',
      avatar: 'https://ui-avatars.com/api/?name=Gladys+Miranda&background=4267B2&color=fff',
      createdAt: new Date().toISOString()
    };
    
    let users = [];
    const existingUsers = localStorage.getItem('memoflip_users');
    if (existingUsers) {
      users = JSON.parse(existingUsers);
    }
    
    let existingUser = users.find((u: any) => u.email === facebookUser.email && u.provider === 'facebook');
    
    if (!existingUser) {
      users.push(facebookUser);
      localStorage.setItem('memoflip_users', JSON.stringify(users));
      existingUser = facebookUser;
    }
    
    localStorage.setItem('memoflip_currentUser', JSON.stringify(existingUser));
    this.flashcardService.setCurrentUser(existingUser);
    
    await this.showToast('Welcome, Gladys Miranda! 🎉', 'success');
    this.router.navigate(['/tabs/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
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