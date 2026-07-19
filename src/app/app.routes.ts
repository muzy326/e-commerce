import { Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ProductsComponent } from './components/products/products.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import {MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';
// Admin Components
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminCategoryComponent } from './components/admin/category/category.component';
import { AdminProductComponent } from './components/admin/product/product.component';
import { AdminOrdersComponent } from './components/admin/orders/orders.component';
import { adminGuard } from './guards/admin.guard';



export const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'products', component: ProductsComponent },

  // Protected user routes (must be logged in)
  { path: 'check-out', component: CheckOutComponent},
  { path: 'my-orders', component: MyOrdersComponent},
   { path: 'my-dashboard', component: MyDashboardComponent },
  { path: 'order-detail/:id', component: OrderDetailComponent},
  { path: 'order-success', component: OrderSuccessComponent},
  { path: 'shopping-cart', component: ShoppingCartComponent},
  {
  path: 'forgot-password',
  loadComponent: () =>
    import('./pages/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
},

  // Admin routes (must be admin)
  {
  path: 'admin/dashboard',
  component: AdminDashboardComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/categories',
  component: AdminCategoryComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/products',
  component: AdminProductComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/orders',
  component: AdminOrdersComponent,
  canActivate: [adminGuard]
},

  // Catch-all route → redirect to login
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
