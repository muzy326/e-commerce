import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  page = 1;
  pageSize = 4;
  myOrders: Order[] = [];

  constructor(private orderService: OrderService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {

  const userId = this.authService.loggedInUserId;

  if (!userId) {
    return;
  }

  this.orderService.getUserOrders(userId).subscribe({
    next: (orders: Order[]) => {
      this.myOrders = orders;
    },
    error: (err) => console.error(err)
  });

}

viewOrder(order: Order): void {

  if (!order.id) {
    return;
  }

  this.router.navigate(
    ['/order-detail', order.id],
    {
      queryParams: {
        viewFrom: 'user'
      }
    }
  );

}
}
