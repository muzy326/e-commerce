import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { OrderService } from '../../services/order.service';
import { ShoppingCardItem } from '../../models/shopping-card-item';
import { Order } from '../../models/order.model';
import { Shipping } from '../../models/shipping.model';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './check-out.component.html'
})
export class CheckOutComponent implements OnInit {

  cartItems: ShoppingCardItem[] = [];
  shipping: Shipping = new Shipping();

  constructor(
    private cartService: ShoppingCartService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.cartItems;
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.totalPrice ?? 0),
      0
    );
  }

  placeOrder(form: NgForm): void {

    if (this.cartItems.length === 0) {
      this.toastr.error('Your cart is empty');
      return;
    }

    if (form.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) {
      this.toastr.error('Please login again');
      this.router.navigate(['/login']);
      return;
    }

    const order: Order = {
      userId,
      datePlaced: Date.now(),
      amount: this.totalPrice,
      items: this.cartItems,
      shippingDetails: { ...this.shipping }
    };

    this.orderService.create(order)
      .then(() => {
        this.cartService.clearCartItems();
        this.toastr.success('Order placed successfully');
        this.router.navigateByUrl('/order-success');
      })
      .catch(err => {
        console.error(err);
        this.toastr.error('Failed to place order');
      });
  }
}
