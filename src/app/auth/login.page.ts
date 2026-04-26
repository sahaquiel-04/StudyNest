import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonCheckbox, IonImg, } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonCheckbox, IonImg],
})
export class LoginPage {
  email = '';
  password = '';
  remember = false;
  emailError = '';
  passwordError = '';
  errorMessage = '';

  constructor(
    private router: Router, 
    private auth: AuthService, 
    private route: ActivatedRoute
  ) {
    const e = this.route.snapshot.queryParamMap.get('e');
    if (e) {
      this.email = e;
    } else {
      const last = localStorage.getItem('last_email');
      if (last) this.email = last;
    }
  }

  signIn() {
  this.clearErrors();

  if (!this.validateInputs()) return;

  const ok = this.auth.login(this.email, this.password, this.remember);

  if (ok) {
    alert('Login successful');
    this.router.navigateByUrl('/tabs/tab1');
  } else {
    this.errorMessage = 'Invalid email or password';
  }
}

  validateInputs(): boolean {
    let valid = true;

    if (!this.email.trim()) {
      this.emailError = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Enter a valid email address';
      valid = false;
    }

    if (!this.password.trim()) {
      this.passwordError = 'Password is required';
      valid = false;
    }

    return valid;
  }

  clearErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.errorMessage = '';
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
