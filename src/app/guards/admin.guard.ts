import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Must be authenticated first
  if (!auth.loggedInUserId) {
    router.navigate(['/login']);
    return false;
  }

  // Must have admin role
  if (!auth.isAdmin) {
    router.navigate(['/products']);
    return false;
  }

  return true;
};
