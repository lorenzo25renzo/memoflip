import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonToggle,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  moon, notifications, play, language, cloudOutline, 
  helpCircle, logOut, trash, informationCircle 
} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonList, IonItem, IonLabel, IonIcon, IonToggle]
})
export class SettingsPage {
  darkMode: boolean = false;
  notifications: boolean = true;
  autoPlay: boolean = false;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({ 
      moon, notifications, play, language, cloudOutline, 
      helpCircle, logOut, trash, informationCircle 
    });
    this.loadSettings();
  }

  loadSettings() {
    const savedDarkMode = localStorage.getItem('memoflip_darkMode');
    const savedNotifications = localStorage.getItem('memoflip_notifications');
    const savedAutoPlay = localStorage.getItem('memoflip_autoPlay');
    
    if (savedDarkMode) this.darkMode = JSON.parse(savedDarkMode);
    if (savedNotifications) this.notifications = JSON.parse(savedNotifications);
    if (savedAutoPlay) this.autoPlay = JSON.parse(savedAutoPlay);
  }

  saveSettings() {
    localStorage.setItem('memoflip_darkMode', JSON.stringify(this.darkMode));
    localStorage.setItem('memoflip_notifications', JSON.stringify(this.notifications));
    localStorage.setItem('memoflip_autoPlay', JSON.stringify(this.autoPlay));
  }

  toggleDarkMode() {
    this.saveSettings();
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  toggleNotifications() {
    this.saveSettings();
    this.showToast('Notifications ' + (this.notifications ? 'enabled' : 'disabled'));
  }

  toggleAutoPlay() {
    this.saveSettings();
    this.showToast('Auto-play ' + (this.autoPlay ? 'enabled' : 'disabled'));
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async changeLanguage() {
    const alert = await this.alertController.create({
      header: 'Select Language',
      inputs: [
        { label: 'English', type: 'radio', value: 'en', checked: true },
        { label: 'Spanish', type: 'radio', value: 'es' },
        { label: 'French', type: 'radio', value: 'fr' },
        { label: 'German', type: 'radio', value: 'de' },
        { label: 'Japanese', type: 'radio', value: 'ja' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Apply', 
          handler: (value) => { 
            console.log('Language changed to:', value);
            this.showToast('Language changed');
          } 
        }
      ]
    });
    await alert.present();
  }

  async syncSettings() {
    const alert = await this.alertController.create({
      header: 'Sync Settings',
      message: '✨ This feature will sync your data across devices.\n\nComing soon! 🚀',
      buttons: ['OK']
    });
    await alert.present();
  }

  async helpSupport() {
    const alert = await this.alertController.create({
      header: '💜 Help & Support',
      message: '📧 Email: support@memoflip.com\n\n📖 FAQ:\n• How to create a deck?\n• How to add flashcards?\n• How to track progress?\n\nVisit our website for more help!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async about() {
    const alert = await this.alertController.create({
      header: 'About MemoFlip',
      message: '📚 Version 1.0.0\n\nMemoFlip is a flashcard app designed to help students study and learn faster. Create decks, add flashcards, and track your progress!\n\n💜 Made with love for learners\n\n© 2024 MemoFlip',
      buttons: ['OK']
    });
    await alert.present();
  }

  async resetAllData() {
    const alert = await this.alertController.create({
      header: '⚠️ Reset All Data',
      message: 'This will delete ALL your decks, flashcards, and progress. This action CANNOT be undone!',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Reset', 
          role: 'destructive',
          handler: () => {
            // Clear all app data except users
            const users = localStorage.getItem('memoflip_users');
            localStorage.clear();
            // Restore users if needed
            if (users) {
              localStorage.setItem('memoflip_users', users);
            }
            this.showToast('All data has been reset');
            setTimeout(() => { window.location.reload(); }, 1500);
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { 
          text: 'Log Out', 
          role: 'destructive',
          handler: async () => {
            // Clear current user session
            localStorage.removeItem('memoflip_currentUser');
            
            // Show logout success message
            const toast = await this.toastController.create({
              message: 'Logged out successfully! 👋',
              duration: 2000,
              position: 'top',
              color: 'success'
            });
            await toast.present();
            
            // Navigate to login page
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}