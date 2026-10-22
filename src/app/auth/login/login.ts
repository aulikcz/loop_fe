import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal<string | null>(null);
  loading = signal(false);

  submit() {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => this.router.navigate(['/games']),
      error: () => {
        this.loading.set(false);
        console.log()
        this.error.set('Nesprávný e-mail nebo heslo.');
      },
    });
  }
}