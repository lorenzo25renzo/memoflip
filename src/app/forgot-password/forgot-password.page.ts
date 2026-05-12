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
import { mail, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonIcon, IonLabel, IonText]
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ mail, arrowBack });
  }

  async resetPassword() {
    if (!this.email) {
      await this.showToast('Please enter your email address', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showToast('Please enter a valid email address', 'warning');
      return;
    }

    const usersData = localStorage.getItem('memoflip_users');
    if (!usersData) {
      await this.showToast('Email not found. Please sign up first.', 'danger');
      return;
    }

    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === this.email);

    if (!user) {
      await this.showToast('Email not found. Please sign up first.', 'danger');
      return;
    }

    // Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Update user's password
    user.password = tempPassword;
    localStorage.setItem('memoflip_users', JSON.stringify(users));

    await this.showToast(`Password reset successful! Your temporary password is: ${tempPassword}`, 'success');
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}