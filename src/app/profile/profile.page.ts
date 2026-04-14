import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, trophy, flame, time, checkmarkCircle } from 'ionicons/icons';
import { FlashcardService } from '../services/flashcard.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class ProfilePage implements OnInit {
  totalCardsStudied: number = 0;
  completionRate: number = 92;
  streak: number = 7;
  topContributors = [
    { name: 'John Doe', points: 1250 },
    { name: 'Jane Smith', points: 980 },
    { name: 'Mike Johnson', points: 750 }
  ];

  constructor(private flashcardService: FlashcardService) {
    addIcons({ personCircle, trophy, flame, time, checkmarkCircle });
  }

  ngOnInit() {
    this.calculateStats();
  }

  calculateStats() {
    const decks = this.flashcardService.getDecks();
    this.totalCardsStudied = decks.reduce((sum, deck) => sum + deck.cardCount, 0);
  }
}