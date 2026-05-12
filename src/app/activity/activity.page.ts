import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, checkmarkCircle, time, trendingUp, flame } from 'ionicons/icons';
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
    addIcons({ calendar, checkmarkCircle, time, trendingUp, flame });
  }

  ngOnInit() {
    this.loadActivityData();
  }

  loadActivityData() {
    // Get real stats from service
    this.stats = this.flashcardService.getStats();
    this.totalCards = this.flashcardService.getTotalCardsCount();
    this.masteredCards = this.flashcardService.getMasteredCardsCount();
    
    // Calculate mastery rate
    this.masteryRate = this.totalCards > 0 ? (this.masteredCards / this.totalCards) * 100 : 0;
    
    // Calculate accuracy
    const totalReviewed = this.stats.correctAnswers + this.stats.incorrectAnswers;
    this.accuracy = totalReviewed > 0 ? (this.stats.correctAnswers / totalReviewed) * 100 : 0;
    
    // Build recent activity from actual data
    this.buildRecentActivity();
  }

  buildRecentActivity() {
    const decks = this.flashcardService.getDecks();
    const allFlashcards: any[] = [];
    
    // Manually flatten the array (replacing flatMap)
    for (let i = 0; i < decks.length; i++) {
      const deck = decks[i];
      const cards = this.flashcardService.getFlashcards(deck.id);
      for (let j = 0; j < cards.length; j++) {
        const card = cards[j];
        allFlashcards.push({
          deckName: deck.name,
          cardQuestion: card.question,
          cardAnswer: card.answer,
          mastered: card.mastered,
          timesReviewed: card.timesReviewed || 0
        });
      }
    }

    // Get recently reviewed cards (those with timesReviewed > 0)
    const reviewedCards = [];
    for (let i = 0; i < allFlashcards.length; i++) {
      if (allFlashcards[i].timesReviewed > 0) {
        reviewedCards.push(allFlashcards[i]);
      }
    }
    
    // Sort by times reviewed (most recent activity simulation)
    reviewedCards.sort((a, b) => b.timesReviewed - a.timesReviewed);
    
    // Take only first 5
    const topReviewed = reviewedCards.slice(0, 5);
    
    this.recentActivity = [];
    for (let i = 0; i < topReviewed.length; i++) {
      const card = topReviewed[i];
      this.recentActivity.push({
        deck: card.deckName,
        cards: 1,
        time: `Reviewed ${card.timesReviewed} time(s)`,
        mastered: card.mastered ? 'Mastered ✓' : 'In Progress'
      });
    }
  }

  getLastStudyDate(): string {
    if (!this.stats.lastStudyDate) return 'Never';
    const lastDate = new Date(this.stats.lastStudyDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }
}