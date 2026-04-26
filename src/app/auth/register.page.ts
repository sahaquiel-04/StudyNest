import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg, IonIcon,} from '@ionic/angular/standalone';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg,
             IonIcon,
  ],
})

  

 export class RegisterPage {
  constructor(private router: Router, private auth: AuthService) {}

  step = 1;
  email = '';
  fullName = '';
  password = '';
  confirm = '';
  error = '';
  showPassword = false;
  showConfirm = false;

  nextStep() {
    this.error = '';

    if (this.step === 1) {
     
      if (!this.validateEmail(this.email)) {
        this.error = 'Please enter a valid email address.';
        return;
      }

      if (this.auth.userExists(this.email)) {
        this.error = 'This email is already registered.';
        return;
      }
    }

    if (this.step === 3 && this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  togglePassword(field?: 'password' | 'confirm') {
    if (field === 'confirm') this.showConfirm = !this.showConfirm;
    else this.showPassword = !this.showPassword;
  }

  signUp() {
    this.error = '';

    if (!this.password || !this.confirm) {
      this.error = 'Please fill out both password fields.';
      return;
    }

    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    const ok = this.auth.register(this.email, this.password);

    if (ok) {
      console.log('✅ Account created:', {
        email: this.email,
        fullName: this.fullName,
        password: this.password,
      });
      alert('Account created successfully! Please log in.');
      this.router.navigate(['/auth/login'], { queryParams: { e: this.email } });
    } else {
      this.error = 'User already exists. Try a different email.';
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
