import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg, IonText, IonGrid, 
        IonButton,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonImg, IonText, IonGrid,
            IonButton,
  ]
})
export class LandingPage implements OnInit {
  isLeaving = false;

  constructor(private router: Router) {}

  goToSignup() {
    this.navigateWithTransition(['/auth/register']);
  }

  goToLogin() {
    this.navigateWithTransition(['/auth/login']);
  }

  private navigateWithTransition(commands: string[]) {
    if (this.isLeaving) return;
    this.isLeaving = true;
    window.setTimeout(() => {
      this.router.navigate(commands);
    }, 220);
  }

  ngOnInit() {
  }

}
