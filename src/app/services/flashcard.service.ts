import { Injectable } from '@angular/core';

export interface Deck {
  id: number;
  name: string;
  cardCount: number;
  subject: string;
  createdAt?: Date;
}

export interface Flashcard {
  id: number;
  deckId: number;
  question: string;
  answer: string;
  mastered?: boolean;
  timesReviewed?: number;
}

export interface StudyStats {
  totalCardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  lastStudyDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private decks: Deck[] = [];
  private flashcards: Flashcard[] = [];
  private stats: StudyStats = {
    totalCardsReviewed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    lastStudyDate: new Date().toISOString()
  };

  constructor() {
    this.loadData();
    if (this.decks.length === 0) {
      this.initializeSampleData();
    }
  }

  private loadData() {
    const savedDecks = localStorage.getItem('memoflip_decks');
    const savedFlashcards = localStorage.getItem('memoflip_flashcards');
    const savedStats = localStorage.getItem('memoflip_stats');

    if (savedDecks) {
      this.decks = JSON.parse(savedDecks);
    }
    if (savedFlashcards) {
      this.flashcards = JSON.parse(savedFlashcards);
    }
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    }
  }

  private saveData() {
    localStorage.setItem('memoflip_decks', JSON.stringify(this.decks));
    localStorage.setItem('memoflip_flashcards', JSON.stringify(this.flashcards));
    localStorage.setItem('memoflip_stats', JSON.stringify(this.stats));
  }

  private initializeSampleData() {
    this.decks = [
      { id: 1, name: 'Biology 101', cardCount: 3, subject: 'Biology', createdAt: new Date() },
      { id: 2, name: 'History of Art', cardCount: 2, subject: 'History', createdAt: new Date() },
      { id: 3, name: 'Java Basics', cardCount: 0, subject: 'Programming', createdAt: new Date() }
    ];

    this.flashcards = [
      { id: 1, deckId: 1, question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', mastered: false, timesReviewed: 0 },
      { id: 2, deckId: 1, question: 'What is the main function of the mitochondrion?', answer: 'To produce energy (ATP) through cellular respiration', mastered: false, timesReviewed: 0 },
      { id: 3, deckId: 1, question: 'What organelle contains digestive enzymes?', answer: 'Lysosomes', mastered: false, timesReviewed: 0 },
      { id: 4, deckId: 2, question: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci', mastered: false, timesReviewed: 0 },
      { id: 5, deckId: 2, question: 'What artistic movement was Van Gogh part of?', answer: 'Post-Impressionism', mastered: false, timesReviewed: 0 }
    ];

    this.saveData();
  }

  getDecks(): Deck[] {
    return this.decks;
  }

  getFlashcards(deckId: number): Flashcard[] {
    return this.flashcards.filter(card => card.deckId === deckId);
  }

  addFlashcard(flashcard: Omit<Flashcard, 'id' | 'mastered' | 'timesReviewed'>): void {
    const newId = Math.max(...this.flashcards.map(f => f.id), 0) + 1;
    const newFlashcard = { 
      ...flashcard, 
      id: newId, 
      mastered: false, 
      timesReviewed: 0 
    };
    this.flashcards.push(newFlashcard);
    
    const deck = this.decks.find(d => d.id === flashcard.deckId);
    if (deck) {
      deck.cardCount = this.flashcards.filter(f => f.deckId === flashcard.deckId).length;
    }
    
    this.saveData();
  }

  addDeck(deck: Omit<Deck, 'id' | 'cardCount' | 'createdAt'>): void {
    const newId = Math.max(...this.decks.map(d => d.id), 0) + 1;
    this.decks.push({ 
      ...deck, 
      id: newId, 
      cardCount: 0, 
      createdAt: new Date() 
    });
    this.saveData();
  }

  deleteDeck(deckId: number): void {
    this.decks = this.decks.filter(d => d.id !== deckId);
    this.flashcards = this.flashcards.filter(f => f.deckId !== deckId);
    this.saveData();
  }

  deleteFlashcard(cardId: number): void {
    const card = this.flashcards.find(f => f.id === cardId);
    if (card) {
      this.flashcards = this.flashcards.filter(f => f.id !== cardId);
      const deck = this.decks.find(d => d.id === card.deckId);
      if (deck) {
        deck.cardCount = this.flashcards.filter(f => f.deckId === card.deckId).length;
      }
      this.saveData();
    }
  }

  updateCardMastery(cardId: number, isCorrect: boolean): void {
    const card = this.flashcards.find(f => f.id === cardId);
    if (card) {
      card.timesReviewed = (card.timesReviewed || 0) + 1;
      
      if (isCorrect && card.timesReviewed >= 3) {
        card.mastered = true;
      }
      
      this.stats.totalCardsReviewed++;
      if (isCorrect) {
        this.stats.correctAnswers++;
        this.stats.streak++;
      } else {
        this.stats.incorrectAnswers++;
        this.stats.streak = 0;
      }
      this.stats.lastStudyDate = new Date().toISOString();
      
      this.saveData();
    }
  }

  getStats(): StudyStats {
    return this.stats;
  }

  getMasteredCardsCount(): number {
    return this.flashcards.filter(c => c.mastered).length;
  }

  getTotalCardsCount(): number {
    return this.flashcards.length;
  }

  getMasteryPercentage(): number {
    if (this.flashcards.length === 0) return 0;
    return (this.getMasteredCardsCount() / this.flashcards.length) * 100;
  }
}