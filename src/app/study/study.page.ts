import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonButton, 
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, refreshOutline, closeCircleOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';
import { FlashcardService, Deck, Flashcard } from '../services/flashcard.service';

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
  private feedbackTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flashcardService: FlashcardService,
    private alertController: AlertController
  ) {
    addIcons({ arrowBackOutline, refreshOutline, closeCircleOutline, checkmarkCircleOutline, arrowForwardOutline });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.deckId = +params['id'];
      this.loadDeck();
    });
  }

  ngOnDestroy() {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
  }

  loadDeck() {
    const decks = this.flashcardService.getDecks();
    this.currentDeck = decks.find((d: Deck) => d.id === this.deckId);
    
    if (this.currentDeck) {
      this.flashcards = this.flashcardService.getFlashcards(this.deckId);
      this.totalCards = this.flashcards.length;
      this.currentCardIndex = 0;
      this.updateCurrentCard();
    }
  }

  updateCurrentCard() {
    if (this.flashcards.length > 0 && this.currentCardIndex < this.flashcards.length) {
      this.currentCard = this.flashcards[this.currentCardIndex];
      this.isFlipped = false;
    }
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  markCorrect() {
    if (this.currentCard) {
      this.flashcardService.updateCardMastery(this.currentCard.id, true);
    }
    this.showFeedback('Correct! Great job!', true);
    this.autoNextCard();
  }

  markIncorrect() {
    if (this.currentCard) {
      this.flashcardService.updateCardMastery(this.currentCard.id, false);
    }
    this.showFeedback('Incorrect. The correct answer is shown above.', false);
  }

  showFeedback(message: string, isCorrect: boolean) {
    this.feedbackMessage = message;
    this.isCorrectFeedback = isCorrect;
    
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }
    
    this.feedbackTimeout = setTimeout(() => {
      this.feedbackMessage = '';
    }, 2000);
  }

  autoNextCard() {
    setTimeout(() => {
      this.nextCard();
    }, 1500);
  }

  nextCard() {
    if (this.currentCardIndex < this.totalCards - 1) {
      this.currentCardIndex++;
      this.updateCurrentCard();
    } else {
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
      header: '🎉 Great Job! 🎉',
      message: `You've completed all cards in this deck!\n\nMastered: ${masteredCount}/${this.totalCards} (${percentage}%)`,
      buttons: [
        {
          text: 'Study Again',
          handler: () => {
            this.currentCardIndex = 0;
            this.updateCurrentCard();
          }
        },
        {
          text: 'Go Home',
          handler: () => {
            this.goBack();
          }
        }
      ]
    });
    
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}