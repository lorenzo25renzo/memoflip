// study/study.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonButton, IonIcon, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, refreshOutline, closeCircleOutline,
  checkmarkCircleOutline, arrowForwardOutline, checkmarkCircle, closeCircle
} from 'ionicons/icons';
import { FlashcardService, Deck, Flashcard } from '../services/flashcard.service';

const MEMO_TIPS: string[] = [
  "You're doing amazing! Keep it up! 🌟",
  "Take it one card at a time — you've got this!",
  "Every flip brings you closer to mastery!",
  "Struggling? That means you're learning! 💪",
  "Review the tricky ones again — repetition is key!",
  "I'm rooting for you all the way! 🧠✨"
];

@Component({
  selector: 'app-study',
  templateUrl: './study.page.html',
  styleUrls: ['./study.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon]
})
export class StudyPage implements OnInit, OnDestroy {
  deckId: number = 0;
  currentDeck?: Deck;
  flashcards: Flashcard[] = [];
  currentCardIndex: number = 0;
  currentCard?: Flashcard;
  totalCards: number = 0;
  isFlipped: boolean = false;
  feedbackMessage: string = '';
  isCorrectFeedback: boolean = true;
  memoTip: string = '';

  // Session tracking
  private sessionCardsStudied: number = 0;
  private sessionCorrect: number = 0;
  private sessionLogged: boolean = false;
  private feedbackTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flashcardService: FlashcardService,
    private alertController: AlertController
  ) {
    addIcons({ arrowBackOutline, refreshOutline, closeCircleOutline, checkmarkCircleOutline, arrowForwardOutline, checkmarkCircle, closeCircle });
    this.memoTip = MEMO_TIPS[Math.floor(Math.random() * MEMO_TIPS.length)];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.deckId = +params['id'];
      this.loadDeck();
    });
  }

  ngOnDestroy() {
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.saveSession();
  }

  private saveSession() {
    if (!this.sessionLogged && this.sessionCardsStudied > 0) {
      this.flashcardService.logStudySession(this.deckId, this.sessionCardsStudied, this.sessionCorrect);
      this.sessionLogged = true;
    }
  }

  loadDeck() {
    const decks = this.flashcardService.getDecks();
    this.currentDeck = decks.find((d: Deck) => d.id === this.deckId);
    if (this.currentDeck) {
      this.flashcards = this.flashcardService.getFlashcards(this.deckId);
      this.totalCards = this.flashcards.length;
      this.currentCardIndex = 0;
      this.sessionCardsStudied = 0;
      this.sessionCorrect = 0;
      this.sessionLogged = false;
      this.updateCurrentCard();
    }
  }

  updateCurrentCard() {
    if (this.flashcards.length > 0 && this.currentCardIndex < this.flashcards.length) {
      this.currentCard = this.flashcards[this.currentCardIndex];
      this.isFlipped = false;
      if (this.currentCardIndex % 3 === 0) {
        this.memoTip = MEMO_TIPS[Math.floor(Math.random() * MEMO_TIPS.length)];
      }
    }
  }

  flipCard() { this.isFlipped = !this.isFlipped; }

  markCorrect() {
    if (this.currentCard) {
      this.flashcardService.updateCardMastery(this.currentCard.id, true);
      this.sessionCardsStudied++;
      this.sessionCorrect++;
    }
    this.showFeedback('Correct! Great job! 🎉', true);
    this.autoNextCard();
  }

  markIncorrect() {
    if (this.currentCard) {
      this.flashcardService.updateCardMastery(this.currentCard.id, false);
      this.sessionCardsStudied++;
    }
    this.showFeedback("That's okay — keep going! 💪", false);
  }

  showFeedback(message: string, isCorrect: boolean) {
    this.feedbackMessage = message;
    this.isCorrectFeedback = isCorrect;
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.feedbackTimeout = setTimeout(() => { this.feedbackMessage = ''; }, 2000);
  }

  autoNextCard() { setTimeout(() => { this.nextCard(); }, 1500); }

  nextCard() {
    if (this.currentCardIndex < this.totalCards - 1) {
      this.currentCardIndex++;
      this.updateCurrentCard();
    } else {
      this.saveSession();
      this.showCompletionMessage();
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.updateCurrentCard();
    }
  }

  async showCompletionMessage() {
    const masteredCount = this.flashcards.filter(c => c.mastered).length;
    const percentage = Math.round((masteredCount / this.totalCards) * 100);
    const alert = await this.alertController.create({
      header: '🎉 Great Job!',
      message: `Memo is proud of you!\n\nMastered: ${masteredCount}/${this.totalCards} (${percentage}%)`,
      buttons: [
        {
          text: 'Study Again',
          handler: () => {
            this.currentCardIndex = 0;
            this.sessionCardsStudied = 0;
            this.sessionCorrect = 0;
            this.sessionLogged = false;
            this.updateCurrentCard();
          }
        },
        { text: 'Go Home', handler: () => { this.goBack(); } }
      ]
    });
    await alert.present();
  }

  goBack() {
    this.saveSession();
    this.router.navigate(['/tabs/home']);
  }
}