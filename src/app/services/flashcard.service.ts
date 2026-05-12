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
  private currentUserId: string = '';
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
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const currentUser = localStorage.getItem('memoflip_currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.currentUserId = user.id || user.email;
      this.loadUserData();
    }
  }

  private loadUserData() {
    if (!this.currentUserId) return;
    
    const savedDecks = localStorage.getItem(`memoflip_decks_${this.currentUserId}`);
    const savedFlashcards = localStorage.getItem(`memoflip_flashcards_${this.currentUserId}`);
    const savedStats = localStorage.getItem(`memoflip_stats_${this.currentUserId}`);

    if (savedDecks) {
      this.decks = JSON.parse(savedDecks);
    } else {
      this.decks = []; // Empty decks for new user
    }
    
    if (savedFlashcards) {
      this.flashcards = JSON.parse(savedFlashcards);
    } else {
      this.flashcards = []; // Empty flashcards for new user
    }
    
    if (savedStats) {
      this.stats = JSON.parse(savedStats);
    } else {
      this.resetStats();
    }
  }

  private resetStats() {
    this.stats = {
      totalCardsReviewed: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      streak: 0,
      lastStudyDate: new Date().toISOString()
    };
  }

  private saveUserData() {
    if (!this.currentUserId) return;
    
    localStorage.setItem(`memoflip_decks_${this.currentUserId}`, JSON.stringify(this.decks));
    localStorage.setItem(`memoflip_flashcards_${this.currentUserId}`, JSON.stringify(this.flashcards));
    localStorage.setItem(`memoflip_stats_${this.currentUserId}`, JSON.stringify(this.stats));
  }

  setCurrentUser(user: any) {
    this.currentUserId = user.id || user.email;
    this.loadUserData();
  }

  clearCurrentUser(): void {
    this.currentUserId = '';
    this.decks = [];
    this.flashcards = [];
    this.resetStats();
    this.saveUserData();
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
    
    this.saveUserData();
  }

  addDeck(deck: Omit<Deck, 'id' | 'cardCount' | 'createdAt'>): void {
    const newId = Math.max(...this.decks.map(d => d.id), 0) + 1;
    this.decks.push({ 
      ...deck, 
      id: newId, 
      cardCount: 0, 
      createdAt: new Date() 
    });
    this.saveUserData();
  }

  deleteDeck(deckId: number): void {
    this.decks = this.decks.filter(d => d.id !== deckId);
    this.flashcards = this.flashcards.filter(f => f.deckId !== deckId);
    this.saveUserData();
  }

  deleteFlashcard(cardId: number): void {
    const card = this.flashcards.find(f => f.id === cardId);
    if (card) {
      this.flashcards = this.flashcards.filter(f => f.id !== cardId);
      const deck = this.decks.find(d => d.id === card.deckId);
      if (deck) {
        deck.cardCount = this.flashcards.filter(f => f.deckId === card.deckId).length;
      }
      this.saveUserData();
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
      
      this.saveUserData();
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