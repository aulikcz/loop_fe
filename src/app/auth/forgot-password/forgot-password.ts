import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service'; // uprav cestu

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private authService = inject(AuthService);

  email = signal('');
  loading = signal(false);
  sent = signal(false);
  error = signal('');

  submit() {
    this.loading.set(true);
    this.error.set('');
    this.authService.forgotPassword(this.email()).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Něco se nepovedlo, zkus to prosím znovu.');
      },
    });
  }
}