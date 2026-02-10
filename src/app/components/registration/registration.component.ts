import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'registration',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

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
  ) {}

  registerAccount() {

    this.authService.register(this.userDetail)
      .subscribe({
        next: (docRef) => {
          this.toastr.success('Registration successful!');
          console.log('New user ID:', docRef.id);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.error('Internal server error!');
          console.error(error);
        }
      });

  }
}
