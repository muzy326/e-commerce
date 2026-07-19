import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loading = false;
  errorMessage = '';

  userDetail: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    displayName: '',
    isAdmin: false
  };

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  login(form: NgForm): void {

    if (form.invalid) {
      this.toastr.warning('Please fill all required fields.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.validate(
      this.userDetail.email!,
      this.userDetail.password!
    ).subscribe({

      next: (users) => {

        this.loading = false;

        if (users.length === 0) {
          this.errorMessage = 'Invalid email or password.';
          this.toastr.error(this.errorMessage);
          return;
        }

        this.toastr.success('Login Successful');
        this.router.navigate(['/products']);

      },

      error: (error) => {

        this.loading = false;
        this.errorMessage = 'Something went wrong.';
        this.toastr.error(this.errorMessage);
        console.error(error);

      }

    });

  }

  forgotPassword(): void {

    this.router.navigate(['/forgot-password']);

  }

}