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

  constructor(private router: Router) {}

  goToSignup() {
    this.router.navigate(['/auth/register']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  ngOnInit() {
  }

}
