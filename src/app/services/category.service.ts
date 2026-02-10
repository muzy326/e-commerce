// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesRef: CollectionReference<Category>;

  constructor(private firestore: Firestore) {
    // Explicitly typing the collection as Category
    this.categoriesRef = collection(this.firestore, 'category') as CollectionReference<Category>;
  }

  // CREATE category
  create(category: Category): Promise<void | string> {
    return addDoc(this.categoriesRef, { ...category })
      .then(docRef => docRef.id)
      .catch(err => {
        console.error('Error creating category:', err);
        throw err;
      });
  }

  // READ all categories
  read(): Observable<Category[]> {
    return collectionData(this.categoriesRef, { idField: 'id' }) as Observable<Category[]>;
  }

  // GET category by ID
  getById(id: string): Observable<Category | undefined> {
    const categoryDoc = doc(this.firestore, `category/${id}`);
    return docData(categoryDoc, { idField: 'id' }) as Observable<Category>;
  }

  // UPDATE category by ID
  update(id: string, category: Category): Promise<void> {
    const categoryDoc = doc(this.firestore, `category/${id}`);
    return updateDoc(categoryDoc, { ...category })
      .catch(err => {
        console.error('Error updating category:', err);
        throw err;
      });
  }

  // DELETE category by ID
  delete(id: string): Promise<void> {
    const categoryDoc = doc(this.firestore, `category/${id}`);
    return deleteDoc(categoryDoc)
      .catch(err => {
        console.error('Error deleting category:', err);
        throw err;
      });
  }
}
