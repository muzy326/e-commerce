import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {

    // 🔴 Replace with real logged user id later
    const userId = 'IvUTrIazqg2FRbpbexGM';

    this.orderService.getUserOrders(userId).subscribe({
      next: (orders: Order[]) => {
        this.myOrders = orders;
      },
      error: (err) => console.error(err)
    });

  }
}
