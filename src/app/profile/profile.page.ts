import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonIcon,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircle, trophy, flame, time, checkmarkCircle, logOut } from 'ionicons/icons';
import { FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class ProfilePage implements OnInit {
  currentUser: any = null;
  totalCardsStudied: number = 0;
  masteredCards: number = 0;
  completionRate: number = 0;
  streak: number = 0;
  accuracy: number = 0;
  topContributors = [
    { name: 'You', points: 0 },
    { name: 'Community', points: 0 },
    { name: 'Learners', points: 0 }
  ];

  constructor(
    private flashcardService: FlashcardService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ personCircle, trophy, flame, time, checkmarkCircle, logOut });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Get current user
    const userData = localStorage.getItem('memoflip_currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      this.currentUser = { name: 'Guest User', email: 'guest@example.com', createdAt: new Date().toISOString() };
    }

    // Get real stats from service
    const stats = this.flashcardService.getStats();
    this.totalCardsStudied = stats.totalCardsReviewed;
    this.masteredCards = this.flashcardService.getMasteredCardsCount();
    this.streak = stats.streak;
    
    // Calculate completion rate (mastered vs total)
    const totalCards = this.flashcardService.getTotalCardsCount();
    this.completionRate = totalCards > 0 ? (this.masteredCards / totalCards) * 100 : 0;
    
    // Calculate accuracy
    const totalReviewed = stats.correctAnswers + stats.incorrectAnswers;
    this.accuracy = totalReviewed > 0 ? (stats.correctAnswers / totalReviewed) * 100 : 0;
    
    // Update top contributors based on actual user data
    this.topContributors = [
      { name: this.currentUser?.name || 'You', points: this.totalCardsStudied },
      { name: 'Community Avg', points: Math.floor(this.totalCardsStudied * 0.7) },
      { name: 'Top Learner', points: Math.floor(this.totalCardsStudied * 1.2) }
    ];
  }

  getMemberSince(): string {
    if (this.currentUser?.createdAt) {
      const date = new Date(this.currentUser.createdAt);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    return '2024';
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
            localStorage.removeItem('memoflip_currentUser');
            this.flashcardService.clearCurrentUser();
            
            const toast = await this.toastController.create({
              message: 'Logged out successfully! 👋',
              duration: 2000,
              position: 'top',
              color: 'success'
            });
            await toast.present();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}