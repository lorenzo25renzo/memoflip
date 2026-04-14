import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonButton,
  IonIcon,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, albumsOutline, trashOutline } from 'ionicons/icons';
import { FlashcardService, Deck } from '../services/flashcard.service';
import { CreateCardModalComponent } from '../components/create-card-model/create-card-model.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon
  ]
})
export class HomePage implements OnInit {
  decks: Deck[] = [];
  masteredCount: number = 0;
  totalCards: number = 0;
  masteryPercentage: number = 0;

  constructor(
    private flashcardService: FlashcardService,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    addIcons({ addCircleOutline, albumsOutline, trashOutline });
  }

  ngOnInit() {
    this.loadDecks();
    this.loadStats();
  }

  loadDecks() {
    this.decks = this.flashcardService.getDecks();
  }

  loadStats() {
    this.masteredCount = this.flashcardService.getMasteredCardsCount();
    this.totalCards = this.flashcardService.getTotalCardsCount();
    this.masteryPercentage = Math.round(this.flashcardService.getMasteryPercentage());
  }

  selectDeck(deck: Deck) {
    if (deck.cardCount > 0) {
      this.router.navigate(['/tabs/study', deck.id]);
    } else {
      this.showEmptyDeckAlert(deck);
    }
  }

  async showEmptyDeckAlert(deck: Deck) {
    const alert = await this.alertController.create({
      header: 'Empty Deck',
      message: `"${deck.name}" has no cards yet. Would you like to add some cards?`,
      buttons: [
        {
          text: 'Later',
          role: 'cancel'
        },
        {
          text: 'Add Cards',
          handler: () => {
            this.openCreateCardModal();
          }
        }
      ]
    });
    await alert.present();
  }

  async createNewDeck() {
    const alert = await this.alertController.create({
      header: 'Create New Deck',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Deck Name (e.g., Biology 101)'
        },
        {
          name: 'subject',
          type: 'text',
          placeholder: 'Subject (e.g., Science)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: (data) => {
            if (data.name && data.subject) {
              this.flashcardService.addDeck({
                name: data.name,
                subject: data.subject
              });
              this.loadDecks();
              this.loadStats();
              this.showSuccessAlert('Deck created successfully!');
            } else {
              this.showErrorAlert('Please fill in both fields');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteDeck(deck: Deck, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Delete Deck',
      message: `Are you sure you want to delete "${deck.name}"? This will also delete all cards in this deck.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.flashcardService.deleteDeck(deck.id);
            this.loadDecks();
            this.loadStats();
          }
        }
      ]
    });
    await alert.present();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async openCreateCardModal() {
    if (this.decks.length === 0) {
      const alert = await this.alertController.create({
        header: 'No Decks Available',
        message: 'Please create a deck first before adding cards.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const modal = await this.modalController.create({
      component: CreateCardModalComponent,
      componentProps: {
        decks: this.decks
      }
    });
    
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.loadDecks();
        this.loadStats();
      }
    });
    
    await modal.present();
  }
}