// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { Observable } from 'rxjs';

// import { Order } from '../../models/order.model';
// import { OrderService } from '../../services/order.service';

// @Component({
//   selector: 'app-order-detail',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './order-detail.component.html',
//   styleUrls: ['./order-detail.component.css']
// })
// export class OrderDetailComponent implements OnInit {
//   orderDetail: Order = new Order();

//   constructor(
//     private orderService: OrderService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const id: string = this.route.snapshot.paramMap.get('id') ?? '';

//     // Add explicit type to the subscription parameter
//     this.orderService.getById(id).subscribe((order: Order) => {
//       if (order) {
//         this.orderDetail = order;
//       } else {
//         console.error('Order not found for id:', id);
//       }
//     });
//   }

//   redirectToOrdersPage(): void {
//     const viewFrom: string | null = this.route.snapshot.queryParamMap.get('viewFrom');
//     if (viewFrom === 'admin') {
//       this.router.navigate(['/admin/orders']);
//     } else {
//       this.router.navigate(['/my-orders']);
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  
   orderId!: string;
  
  orderDetail: Order = new Order();

  constructor(private orderService: OrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

     this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.loadOrder(this.orderId);
    
    }
  
  loadOrder(id: string): void {
    this.orderService.getOrderById(id)
    .subscribe({
   next: (order: unknown) => {
    this.orderDetail = order as Order;
  },
  error: err => console.error(err)
});
  }
  redirectToOrdersPage() {
    let viewFrom = this.route.snapshot.queryParamMap.get('viewFrom');
    if (viewFrom === 'admin') {
      this.router.navigate(['/admin/orders']);
    }
    else {
      this.router.navigate(['/my-orders']);
    }
  }

}

