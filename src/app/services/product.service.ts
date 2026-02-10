// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsCollection: CollectionReference<Product>;

  constructor(private firestore: Firestore) {
    // 🔹 Use the correct collection name
    this.productsCollection = collection(this.firestore, 'product') as CollectionReference<Product>;
  }

  private parsePrice(price: string | number | undefined): number {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price.replace(/[^\d.]/g, '')) || 0;
    return 0;
  }

  // CREATE
  create(product: Product) {
    return addDoc(this.productsCollection, { ...product });
  }

  // READ with optional category and search term
  read(category?: string, searchTerm?: string): Observable<Product[]> {
    let q: any = this.productsCollection;
    if (category) q = query(this.productsCollection, where('category', '==', category));

    return collectionData(q, { idField: 'id' }).pipe(
      map((products: Product[]) =>
        products
          .map(p => ({
            ...p,
            price: this.parsePrice(p.price),
            title: p.title ?? 'Unnamed Product',
            imageUrl: p.imageUrl ?? 'assets/no-image.png'
          }))
          .filter(p =>
            searchTerm ? p.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
          )
      )
    );
  }

  // UPDATE
  update(id: string, product: Product) {
    return updateDoc(doc(this.firestore, `product/${id}`), { ...product });
  }

  // DELETE
  delete(id: string) {
    return deleteDoc(doc(this.firestore, `product/${id}`));
  }
}
