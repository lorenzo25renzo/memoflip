import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ModalController, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonSelect, 
  IonSelectOption, 
  IonInput, 
  IonTextarea 
} from '@ionic/angular/standalone';
import { FlashcardService, Deck } from '../../services/flashcard.service';

@Component({
  selector: 'app-create-card-model',
  templateUrl: './create-card-model.component.html',
  styleUrls: ['./create-card-model.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonTextarea
  ]
})
export class CreateCardModalComponent {
  @Input() decks: Deck[] = [];
  
  selectedDeckId: number = 0;
  question: string = '';
  answer: string = '';

  constructor(
    private modalController: ModalController,
    private flashcardService: FlashcardService
  ) {}

  isFormValid(): boolean {
    return this.selectedDeckId > 0 && 
           this.question.trim().length > 0 && 
           this.answer.trim().length > 0;
  }

  createCard() {
    if (this.isFormValid()) {
      this.flashcardService.addFlashcard({
        deckId: this.selectedDeckId,
        question: this.question.trim(),
        answer: this.answer.trim()
      });
      
      this.modalController.dismiss(true);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}