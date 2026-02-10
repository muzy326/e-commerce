import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { ShoppingCartService } from "../../services/shopping-cart.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit {

  totalItems: number = 0;
  dropdownOpen: boolean = false;
  mobileMenuOpen: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.totalItems = cart?.length ?? 0;
    });
  }

  // Display name getter from localStorage
  get displayName(): string | null {
    return localStorage.getItem('displayName');
  }

  // Admin check from AuthService
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  // Dropdown toggle
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  // Mobile menu toggle
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.cartService.clearCartItems();
    this.authService.logout();

    localStorage.removeItem('displayName');
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('isAdmin');

    this.closeDropdown();
    this.router.navigate(['/login']);
  }
}
