// src/app/services/shopping-cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCardItem } from '../models/shopping-card-item';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {

  private _items: ShoppingCardItem[] = [];
  private cartSubject = new BehaviorSubject<ShoppingCardItem[]>([]);

  // observable for components
  cart$ = this.cartSubject.asObservable();

  // ---------- getters ----------
  get cartItems(): ShoppingCardItem[] {
    return [...this._items];
  }

  get totalItems(): number {
    return this._items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPrice(): number {
    return this._items.reduce((sum, i) => sum + i.totalPrice, 0);
  }

  // ---------- cart actions ----------
  addItem(item: ShoppingCardItem): void {
    const existing = this._items.find(i => i.productId === item.productId);

    if (existing) {
      existing.quantity++;
      existing.totalPrice = existing.quantity * existing.price;
    } else {
      this._items.push({ ...item });
    }

    this.cartSubject.next(this.cartItems);
  }

  removeItem(item: ShoppingCardItem): void {
    const existing = this._items.find(i => i.productId === item.productId);
    if (!existing) return;

    existing.quantity--;
    existing.totalPrice = existing.quantity * existing.price;

    if (existing.quantity <= 0) {
      this._items = this._items.filter(i => i.productId !== item.productId);
    }

    this.cartSubject.next(this.cartItems);
  }

  getQuantity(productId: string): number {
    return this._items.find(i => i.productId === productId)?.quantity ?? 0;
  }

  clearCartItems(): void {
    this._items = [];
    this.cartSubject.next([]);
  }
}
