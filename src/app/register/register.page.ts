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
    private toastController: ToastController
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
    console.log('Register attempt:', { name: this.name, email: this.email });
    
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

    // Get existing users
    let users = [];
    const existingUsers = localStorage.getItem('memoflip_users');
    if (existingUsers) {
      users = JSON.parse(existingUsers);
    }
    
    // Check if email already exists
    if (users.find((u: any) => u.email === this.email)) {
      await this.showToast('Email already registered. Please login.', 'danger');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('memoflip_users', JSON.stringify(users));
    
    console.log('New user registered:', newUser);
    console.log('All users:', users);
    
    await this.showToast('Account created successfully! Please login.', 'success');
    this.router.navigate(['/login']);
  }

  async googleSignUp() {
    await this.showToast('Google sign up coming soon! Use email registration.', 'info');
  }

  async facebookSignUp() {
    await this.showToast('Facebook sign up coming soon! Use email registration.', 'info');
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