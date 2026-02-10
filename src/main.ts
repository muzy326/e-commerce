import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

// AngularFire
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Services
import { AuthService } from './app/services/auth.service';
import { CategoryService } from './app/services/category.service';
import { ProductService } from './app/services/product.service';
import { OrderService } from './app/services/order.service';
import { ShoppingCartService } from './app/services/shopping-cart.service';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({ positionClass: 'toast-bottom-right' }),

    // ✅ Initialize Firebase App FIRST
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    // ✅ Then provide Auth and Firestore
    provideAuth(() => getAuth()),         // Auth provider
    provideFirestore(() => getFirestore()),

    // ✅ App services
    AuthService,
    CategoryService,
    ProductService,
    OrderService,
    ShoppingCartService
  ]
}).catch(err => console.error(err));
