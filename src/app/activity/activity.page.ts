import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, checkmarkCircle, time } from 'ionicons/icons';
import { FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class ActivityPage implements OnInit {
  totalStudyTime: string = '12.5 hours';
  cardsMastered: number = 0;
  weeklyProgress: number = 75;
  
  recentActivity = [
    { deck: 'Biology 101', cards: 25, date: 'Today', time: '2 hours ago' },
    { deck: 'History of Art', cards: 15, date: 'Yesterday', time: '1 day ago' },
    { deck: 'Java Basics', cards: 30, date: '2 days ago', time: '2 days ago' }
  ];

  constructor(private flashcardService: FlashcardService) {
    addIcons({ calendar, checkmarkCircle, time });
  }

  ngOnInit() {
    this.loadActivity();
  }

  loadActivity() {
    const decks = this.flashcardService.getDecks();
    this.cardsMastered = decks.reduce((sum, deck) => sum + deck.cardCount, 0);
  }
}