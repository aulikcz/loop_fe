import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';

  password = signal('');
  confirm = signal('');
  loading = signal(false);
  error = signal('');

  submit() {
    if (this.password().length < 8) {
      this.error.set('Heslo musí mít alespoň 8 znaků.');
      return;
    }
    if (this.password() !== this.confirm()) {
      this.error.set('Hesla se neshodují.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.authService.resetPassword(this.token, this.password()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Odkaz je neplatný nebo vypršel. Požádej o nový.');
      },
    });
  }
}