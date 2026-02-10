// src/app/components/admin/category/category.component.ts
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbPaginationModule
  ],
  
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  categories: Category[] = [];
  page = 1;
  pageSize = 4;
  modalHeader = '';
  selectedCategoryId: string | null = null;

  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.read().subscribe({
      next: (res: Category[]) => {
        this.categories = res;
        console.log('Categories loaded:', this.categories);
      },
      error: (err: any) => console.error(err)
    });
  }

  addCategory() {
    this.modalHeader = 'Add Category';
    this.selectedCategoryId = null;
    this.categoryForm.reset();
  }

  editCategory(category: Category) {
    this.modalHeader = 'Edit Category';
    this.selectedCategoryId = category.id!;
    this.categoryForm.patchValue(category);
  }

  saveCategory() {
    const data = this.categoryForm.value;

    if (this.selectedCategoryId) {
      this.categoryService.update(this.selectedCategoryId, data)
        .then(() => {
          this.toastr.success('Category updated successfully');
          this.loadCategories();
        })
        .catch(() => this.toastr.error('Failed to update category'));
    } else {
      this.categoryService.create(data)
        .then(() => {
          this.toastr.success('Category added successfully');
          this.loadCategories();
        })
        .catch(() => this.toastr.error('Failed to add category'));
    }
  }

  deleteCategory(id: string) {
    this.categoryService.delete(id)
      .then(() => {
        this.toastr.success('Category deleted successfully');
        this.loadCategories();
      })
      .catch(() => this.toastr.error('Failed to delete category'));
  }
}
