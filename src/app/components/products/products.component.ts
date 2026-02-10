// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCardItem } from '../../models/shopping-card-item';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
     this.selectedCategory = 'Woman clothing';
    this.loadProducts();
  }

  loadCategories(): void {
    // Hardcoded example, can be loaded from Firestore if needed
    this.categories = ['Woman clothing', 'Mens clothing', 'Kids clothing', 'Accessories'];
  }

  loadProducts(): void {
    this.productService.read(this.selectedCategory, this.searchTerm).subscribe({
      next: products => {
        console.log('Loaded products:', products); // 🔹 Confirm connection
        this.products = products;
      },
      error: err => console.error('Error loading products:', err)
    });
  }

  changeCategory(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    const cartItem: ShoppingCardItem = {
      productId: product.id!,
      title: product.title ?? 'Unnamed Product',
      price: product.price ?? 0,
      quantity: 1,
      totalPrice: product.price ?? 0,
      imageUrl: product.imageUrl ?? 'assets/no-image.png'
    };
    this.cartService.addItem(cartItem);
  }

  removeFromCart(product: Product): void {
    const cartItem: ShoppingCardItem = {
      productId: product.id!,
      title: product.title ?? 'Unnamed Product',
      price: product.price ?? 0,
      quantity: 1,
      totalPrice: product.price ?? 0,
      imageUrl: product.imageUrl ?? 'assets/no-image.png'
    };
    this.cartService.removeItem(cartItem);
  }

  getQuantity(product: Product): number {
    return this.cartService.getQuantity(product.id!);
  }
}
