import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderId!: string;

  orderDetail: Order = new Order();

  loggedInUserId: string | null = localStorage.getItem('loggedInUserId');

  isAdmin: boolean = localStorage.getItem('isAdmin') === 'true';


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.orderId = this.route.snapshot.paramMap.get('id')!;

    this.loadOrder(this.orderId);

  }


  loadOrder(id: string): void {

    this.orderService.getOrderById(id)
      .subscribe({

       next: (order: Order | undefined) => {

  if (!order) {

    this.router.navigate(['/products']);
    return;

  }

  if (
    this.isAdmin ||
    order.userId === this.loggedInUserId
  ) {

    this.orderDetail = order;

  } else {

    this.router.navigate(['/products']);

  }

},


        error: err => {

          console.error(err);

          this.router.navigate(['/products']);

        }

      });

  }



  cancelOrder(): void {


    if (

      this.orderDetail.userId === this.loggedInUserId &&
      !this.isAdmin &&
      this.orderDetail.status !== 'Cancelled'

    ) {


      this.orderService.cancelOrder(this.orderDetail.id!)

        .then(() => {


          this.orderDetail.status = 'Cancelled';


          alert('Order cancelled successfully');


        })

        .catch(error => {

          console.error(error);

          alert('Unable to cancel order');

        });


    } 
    else {


      alert('You cannot cancel this order');


    }


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