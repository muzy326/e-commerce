// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

// // eslint-disable-next-line deprecation/deprecation
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { ToastrModule } from 'ngx-toastr';

// import { AppComponent } from './app.component';
// import { LoginComponent } from './components/login/login.component';
// import { RegistrationComponent } from './components/registration/registration.component';

// import { environment } from '../environments/environment';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegistrationComponent },
//   // Add your other routes here
// ];

// @NgModule({
//   declarations: [
//     // AppComponent,
//     // LoginComponent,
//     // RegistrationComponent
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     HttpClientModule,
//     BrowserAnimationsModule,      // required for Toastr
//     ToastrModule.forRoot(),       // ngx-toastr
//     AngularFireModule.initializeApp(environment.firebaseConfig),
//     AngularFirestoreModule,
//     RouterModule.forRoot(routes)
//   ],
//   providers: [],
//   bootstrap: [AppComponent]       // <-- must be AppComponent, not AppModule
// })
// export class AppModule {}
