// src/app/admin/components/product/product.component.ts
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgbPaginationModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  productForm!: FormGroup;
  modalHeader = 'New Product';
  selectedProductId: string | null = null;
  searchTerm = '';
  page = 1;
  pageSize = 4;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /** Initialize the reactive form */
  private initForm(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  /** Load categories from API */
  private loadCategories(): void {
    this.categoryService.read().subscribe({
      next: (categories: Category[]) => this.categories = categories,
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  /** Load products from API */
  private loadProducts(): void {
    this.productService.read().subscribe({
      next: (products: Product[]) => {
        this.products = products.map(p => ({
          id: p.id ?? '',
          title: p.title ?? 'Untitled Product',
          price: Number(p.price) || 0,
          imageUrl: p.imageUrl ?? 'assets/no-image.png',
          category: p.category ?? 'Uncategorized'
        }));
        this.filteredProducts = [...this.products];
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  /** Filter products based on search term */
  filterData(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p => p.title?.toLowerCase().includes(term));
    this.page = 1;
  }

  /** Prepare form for adding a new product */
  addProduct(): void {
    this.modalHeader = 'New Product';
    this.productForm.reset();
    this.selectedProductId = null;
  }

  /** Prepare form for editing an existing product */
  editProduct(product: Product): void {
    this.modalHeader = 'Edit Product';
    this.selectedProductId = product.id ?? null;
    this.productForm.patchValue(product);
  }

  /** Save product (create or update) */
  saveProduct(): void {
    if (this.productForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly.');
      return;
    }

    const productData = this.productForm.value;

    if (this.selectedProductId) {
      this.productService.update(this.selectedProductId, productData)
        .then(() => {
          this.toastr.success('Product updated successfully');
          this.loadProducts();
        })
        .catch(err => {
          console.error('Update failed:', err);
          this.toastr.error('Failed to update product');
        });
    } else {
      this.productService.create(productData)
        .then(() => {
          this.toastr.success('Product added successfully');
          this.loadProducts();
        })
        .catch(err => {
          console.error('Creation failed:', err);
          this.toastr.error('Failed to add product');
        });
    }
  }

  /** Delete a product */
  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id)
      .then(() => {
        this.toastr.success('Product deleted successfully');
        this.loadProducts();
      })
      .catch(err => {
        console.error('Deletion failed:', err);
        this.toastr.error('Failed to delete product');
      });
  }
}
