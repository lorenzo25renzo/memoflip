import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonIcon, IonSpinner, ModalController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, sparklesOutline, alertCircleOutline } from 'ionicons/icons';
import { TriviaService, TriviaCategory } from '../../services/trivia.service';
import { FlashcardService } from '../../services/flashcard.service';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-trivia-modal',
  templateUrl: './trivia-modal.component.html',
  styleUrls: ['./trivia-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonIcon, IonSpinner
  ]
})
export class TriviaModalComponent implements OnInit {
  categories: TriviaCategory[] = [];
  selectedCategoryId: number = 0;
  selectedDifficulty: Difficulty = 'easy';
  selectedAmount: number = 10;
  isLoadingCategories: boolean = true;
  isGenerating: boolean = false;
  errorMessage: string = '';

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private triviaService: TriviaService,
    private flashcardService: FlashcardService
  ) {
    addIcons({ closeOutline, sparklesOutline, alertCircleOutline });
  }

  async ngOnInit() {
    try {
      this.categories = await this.triviaService.getCategories();
      this.selectedCategoryId = this.categories[0]?.id;
      this.isLoadingCategories = false;
    } catch (e) {
      this.errorMessage = 'Could not load categories. Check your internet connection.';
      this.isLoadingCategories = false;
    }
  }

  setCategory(id: number) {
    this.selectedCategoryId = id;
  }

  getSelectedCategoryName(): string {
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name || '';
  }

  setDifficulty(value: Difficulty) {
    this.selectedDifficulty = value;
  }

  setAmount(value: number) {
    this.selectedAmount = value;
  }

  async generateDeck() {
    if (!this.selectedCategoryId) return;
    this.isGenerating = true;
    this.errorMessage = '';

    try {
      const questions = await this.triviaService.getQuestions(
        this.selectedCategoryId,
        this.selectedDifficulty,
        this.selectedAmount
      );

      const category = this.categories.find(c => c.id === this.selectedCategoryId);
      const deckName = `${category?.name} (${this.selectedDifficulty})`;
      const subject = category?.name || 'Trivia';

      this.flashcardService.addDeck({ name: deckName, subject });
      const decks = this.flashcardService.getDecks();
      const newDeck = decks[decks.length - 1];

      for (const q of questions) {
        this.flashcardService.addFlashcard({
          deckId: newDeck.id,
          question: this.triviaService.decodeHtml(q.question),
          answer: this.triviaService.decodeHtml(q.correct_answer)
        });
      }

      const toast = await this.toastController.create({
        message: `🧠 Memo created "${deckName}" with ${questions.length} cards!`,
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
      this.modalController.dismiss({ created: true });

    } catch (e) {
      this.errorMessage = 'Failed to generate deck. The trivia server may be busy — try again.';
    } finally {
      this.isGenerating = false;
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}