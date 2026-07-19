import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbPaginationModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  page = 1;
  pageSize = 4;
  adminOrders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.authService.isAdmin) {
      this.router.navigate(['/products']);
      return;
    }

    this.loadOrders();
  }

  // Load all orders
  loadOrders(): void {

    this.orderService.getAdminOrders().subscribe({
      next: (orders: Order[]) => {
         console.log('Admin Orders:', orders);
        this.adminOrders = orders;
      },
      error: (err) => console.error(err)
    });

  }

  // Open order details
  viewOrder(order: Order): void {

    this.router.navigate(
      ['/order-detail', order.id],
      {
        queryParams: {
          viewFrom: 'admin'
        }
      }
    );

  }

  // Update order status
  updateOrderStatus(order: Order, status: string): void {

    this.orderService.updateOrderStatus(order.id!, status)
      .then(() => {

        order.status = status;

        this.refreshOrders();

      })
      .catch(error => {

        console.error(error);

      });

  }

  // Cancel order
  cancelOrder(order: Order): void {

    this.updateOrderStatus(order, 'Cancelled');

  }

  // Refresh table
  refreshOrders(): void {

    this.loadOrders();

  }

}