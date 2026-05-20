// about/about.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, happyOutline, cardOutline,
  cloudOfflineOutline, addCircleOutline, colorPaletteOutline, lockClosedOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon]
})
export class AboutPage {
  constructor(private router: Router) {
    addIcons({ arrowBackOutline, happyOutline, cardOutline, cloudOfflineOutline, addCircleOutline, colorPaletteOutline, lockClosedOutline });
  }

  goBack() { window.history.back(); }
}