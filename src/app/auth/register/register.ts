import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  displayName = signal('');
  email = signal('');
  password = signal('');
  error = signal<string | null>(null);
  loading = signal(false);

  submit() {
    this.error.set(null);
    this.loading.set(true);

    const displayName = this.displayName();
    const email = this.email();
    const password = this.password();

    this.auth
      .register({ displayName, email, password })
      .pipe(switchMap(() => this.auth.login({ email, password })))
      .subscribe({
        next: () => this.router.navigate(['/games']),
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(
            err.status === 409
              ? 'Tento e-mail už je zaregistrovaný.'
              : 'Registrace se nepovedla, zkontroluj zadané údaje.',
          );
        },
      });
  }
}