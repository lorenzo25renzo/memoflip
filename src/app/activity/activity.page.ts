// activity/activity.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircle, time, flame, calendarClearOutline } from 'ionicons/icons';
import { FlashcardService, StudyStats } from '../services/flashcard.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class ActivityPage implements OnInit {
  stats: StudyStats = {
    totalCardsReviewed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    lastStudyDate: new Date().toISOString()
  };

  totalCards: number = 0;
  masteredCards: number = 0;
  masteryRate: number = 0;
  accuracy: number = 0;
  recentActivity: any[] = [];

  constructor(private flashcardService: FlashcardService) {
    addIcons({ calendarOutline, checkmarkCircle, time, flame, calendarClearOutline });
  }

  ngOnInit() { this.loadActivityData(); }

  // Refreshes every time the tab is visited
  ionViewWillEnter() { this.loadActivityData(); }

  loadActivityData() {
    this.stats = this.flashcardService.getStats();
    this.totalCards = this.flashcardService.getTotalCardsCount();
    this.masteredCards = this.flashcardService.getMasteredCardsCount();
    this.masteryRate = this.totalCards > 0 ? (this.masteredCards / this.totalCards) * 100 : 0;

    const totalAnswered = this.stats.correctAnswers + this.stats.incorrectAnswers;
    this.accuracy = totalAnswered > 0 ? (this.stats.correctAnswers / totalAnswered) * 100 : 0;

    // Pull real study sessions
    const sessions = this.flashcardService.getStudySessions();
    this.recentActivity = sessions.map(session => ({
      deck: session.deckName,
      cards: session.cardsStudied,
      correct: session.correctAnswers,
      accuracy: session.cardsStudied > 0
        ? Math.round((session.correctAnswers / session.cardsStudied) * 100)
        : 0,
      time: this.formatSessionDate(session.date),
      mastered: session.correctAnswers === session.cardsStudied ? 'All Correct ✓' : 'In Progress'
    }));
  }

  formatSessionDate(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  getLastStudyDate(): string {
    if (!this.stats.lastStudyDate) return 'Never';
    return this.formatSessionDate(this.stats.lastStudyDate);
  }
}