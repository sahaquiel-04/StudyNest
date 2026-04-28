import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, schoolOutline, chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './app-bottom-nav.component.html',
  styleUrls: ['./app-bottom-nav.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class AppBottomNavComponent {
  @Input() currentRoute: string = '';

  constructor(private router: Router) {
    addIcons({ homeOutline, schoolOutline, chatbubbleOutline });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
