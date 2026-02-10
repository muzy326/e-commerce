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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userDetail: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    displayName: '',
    isAdmin: false
  };

  // ✅ Add missing properties
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.auth.validate(this.userDetail.email!, this.userDetail.password!)
      .subscribe({
        next: (response: User[]) => this.handleSuccess(response),
        error: (err) => this.handleError(err)
      });
  }

  handleSuccess(response: User[]) {
    this.loading = false;

    if (response.length > 0) {
      const user = response[0];
      localStorage.setItem('displayName', user.displayName ?? '');
      localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
      this.toastr.success('Login successful!');
      this.router.navigate(['/products']); // Navigate to products or dashboard
    } else {
      this.errorMessage = 'Invalid credentials!';
      this.toastr.error(this.errorMessage);
    }
  }

  handleError(error: any) {
    this.loading = false;
    this.errorMessage = 'Login failed!';
    this.toastr.error(this.errorMessage);
    console.error(error);
  }
}
