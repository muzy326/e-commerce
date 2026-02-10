// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where,
  doc,
  docData,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersRef: CollectionReference;

  constructor(private firestore: Firestore,private authService: AuthService) {
    this.ordersRef = collection(this.firestore, 'orders');
  }

  // CREATE ORDER
  create(order: Order) {
      const userId = this.authService.loggedInUserId;

  const newOrder = {
    ...order,
    userId: userId,
    datePlaced: Date.now()
  };
    return addDoc(this.ordersRef, newOrder);
  }

  // GET ALL ORDERS (ADMIN)
  getAdminOrders(): Observable<Order[]> {
    return collectionData(this.ordersRef, {
      idField: 'id'
    }) as Observable<Order[]>;
  }

  // GET USER ORDERS
  getUserOrders(userId: string): Observable<Order[]> {
    const q = query(
      this.ordersRef,
      where('userId', '==', userId)
    );

    return collectionData(q, {
      idField: 'id'
    }) as Observable<Order[]>;
  }

  // GET ORDER BY ID
  getOrderById(id: string): Observable<Order> {
    const orderDoc = doc(this.firestore, `orders/${id}`);
    return docData(orderDoc, {
      idField: 'id'
    }) as Observable<Order>;
  }
}
