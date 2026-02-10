import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { ShoppingCardItem } from '../../../models/shopping-card-item';
import { DonutChartComponent } from '../../charts/donut-chart/donut-chart.component';
import { PieChartComponent } from '../../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../charts/bar-chart/bar-chart.component';



interface ProductSales {
  name: string;
  value: number;
}

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbPaginationModule,
    DonutChartComponent,
    PieChartComponent,
    BarChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loader = false;

  saleProductData: ProductSales[] = [];
  saleProductDataInput: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loader = false;

    this.orderService.getAdminOrders().subscribe((orders: Order[]) => {
      const productOrderItems: ProductSales[] = [];

      orders.forEach(order => {
        const items: ShoppingCardItem[] = order.items ?? [];
        items.forEach(item => {
          const name = item.title ?? 'Unnamed Product';
          const value = item.totalPrice ?? 0;
          productOrderItems.push({ name, value });
        });
      });

      // Aggregate product sales
      this.saleProductData = productOrderItems.reduce<ProductSales[]>((acc, item) => {
        const existing = acc.find(ai => ai.name === item.name);
        if (existing) existing.value += item.value;
        else acc.push({ ...item });
        return acc;
      }, []);

      // Prepare input for BarChart
      this.saleProductDataInput = {
        data: this.saleProductData,
        xAxis: 'name',
        yAxis: 'value'
      };

      this.loader = true;
    });
  }
}
