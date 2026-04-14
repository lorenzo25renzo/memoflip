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

updateCardMastery(cardId: number, isCorrect: boolean): void {
  const card = this.flashcards.find(f => f.id === cardId);
  if (card) {
    card.timesReviewed = (card.timesReviewed || 0) + 1;
    
    if (isCorrect && card.timesReviewed >= 3) {
      card.mastered = true;
    }
    
    this.saveData();
  }
}