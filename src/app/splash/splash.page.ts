import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { fingerPrintOutline } from 'ionicons/icons';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class SplashPage {
  isAnimating: boolean = false;
  animationStarted: boolean = false;
  private animationTimeout: any;

  constructor(private router: Router) {
    addIcons({ fingerPrintOutline });
  }

  startAnimation() {
    // Prevent multiple clicks
    if (this.animationStarted) return;
    
    this.animationStarted = true;
    this.isAnimating = true;
    
    // Wait for animation to complete (2 seconds)
    this.animationTimeout = setTimeout(() => {
      this.navigateToNextPage();
    }, 2000);
  }

  navigateToNextPage() {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('memoflip_currentUser');
    
    if (currentUser) {
      this.router.navigate(['/tabs/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}