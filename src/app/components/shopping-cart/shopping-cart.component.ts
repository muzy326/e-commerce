// src/app/components/shopping-cart/shopping-cart.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCardItem } from '../../models/shopping-card-item';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  cartItems: ShoppingCardItem[] = [];
  private sub!: Subscription;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.cartService.cart$
      .subscribe(items => this.cartItems = items);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  add(item: ShoppingCardItem): void {
    this.cartService.addItem(item);
  }

  remove(item: ShoppingCardItem): void {
    this.cartService.removeItem(item);
  }

  clear(): void {
    this.cartService.clearCartItems();
  }

  checkout(): void {
    this.router.navigate(['/check-out']);
  }

  get totalItems(): number {
    return this.cartService.totalItems;
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }
}
