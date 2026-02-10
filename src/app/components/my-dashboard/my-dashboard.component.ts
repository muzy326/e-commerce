import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { ShoppingCardItem } from '../../models/shopping-card-item';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { DonutChartComponent } from '../charts/donut-chart/donut-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';


@Component({
  selector: 'my-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbPaginationModule,
    PieChartComponent,
    DonutChartComponent,
    BarChartComponent
  ],
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

  loader: boolean = false;

  // Chart Data
  saleProductData: { name: string, value: number }[] = [];
  saleUserData: { userId: string, name: string, value: number }[] = [];
  saleProductDataInput: any;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loader = false;

    const userId = this.authService.loggedInUserId;

    if (!userId) {
      console.warn('No logged-in user found.');
      this.loader = true;
      return;
    }

    // Fetch all orders for this user from Firebase
    this.orderService.getUserOrders(userId).subscribe({
      next: (orders: Order[]) => {
        if (!orders || orders.length === 0) {
          console.warn('No orders found.');
          this.loader = true;
          return;
        }

        // Temporary arrays for aggregation
        const productItems: { name: string, value: number }[] = [];
        const userItems: { userId: string, name: string, value: number }[] = [];

        // Loop through orders and collect product and user sales
        orders.forEach(order => {
          order.items.forEach((item: ShoppingCardItem) => {
            productItems.push({ name: item.title, value: item.totalPrice || 0 });
          });

          userItems.push({
            userId: order.userId!,
            name: order.shippingDetails.name,
            value: order.amount || 0
          });
        });

        // Aggregate product sales
        this.saleProductData = productItems.reduce((acc: any[], item) => {
          const existing = acc.find(i => i.name === item.name);
          if (existing) existing.value += item.value;
          else acc.push({ ...item });
          return acc;
        }, []);

        // Aggregate user sales
        this.saleUserData = userItems.reduce((acc: any[], item) => {
          const existing = acc.find(i => i.userId === item.userId);
          if (existing) existing.value += item.value;
          else acc.push({ ...item });
          return acc;
        }, []);

        // Prepare chart input
        this.saleProductDataInput = {
          data: this.saleProductData,
          xAxis: 'name',
          yAxis: 'value'
        };

        this.loader = true;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loader = true;
      }
    });
  }
}
