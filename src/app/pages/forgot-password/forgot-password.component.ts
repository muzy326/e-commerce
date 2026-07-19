import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  resetPassword() {

    this.auth.resetPassword(this.email, this.password)
      .subscribe({

        next: () => {

          this.toastr.success('Password Updated Successfully');
          this.router.navigate(['/login']);

        },

        error: () => {

          this.toastr.error('Email not found');

        }

      });

  }

}