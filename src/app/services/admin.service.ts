// import { Injectable } from '@angular/core';
// import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
// import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

// export interface LoggedUser {
//   uid: string;
//   email: string | null;
//   displayName: string;
//   role: 'admin' | 'user';
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminService {

//   constructor(
//     private auth: Auth,
//     private firestore: Firestore
//   ) {}

//   async login(email: string, password: string): Promise<LoggedUser> {
//     if (!email || !password) {
//       throw new Error('Email and password are required');
//     }

//     try {
//       // 1️⃣ Firebase Auth login
//       const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
//       const user = userCredential.user;

//       // 2️⃣ Get Firestore profile
//       const userRef = doc(this.firestore, `user/${user.uid}`);
//       const userSnap = await getDoc(userRef);

//       let userData: any;
//       if (!userSnap.exists()) {
//         // 🔹 Firestore document missing → create automatically
//         console.warn('User profile not found, creating Firestore document automatically');
//         userData = {
//           displayName: user.email,
//           isAdmin: false
//         };
//         await setDoc(userRef, userData);
//       } else {
//         userData = userSnap.data();
//       }

//       // 3️⃣ Map to LoggedUser
//       const loggedUser: LoggedUser = {
//         uid: user.uid,
//         email: user.email,
//         displayName: userData.displayName || user.email || 'No Name',
//         role: userData.isAdmin ? 'admin' : 'user'
//       };

//       // 4️⃣ Save session
//       localStorage.setItem('user', JSON.stringify(loggedUser));

//       return loggedUser;

//     } catch (err: any) {
//       console.error('Login error:', err.message || err);
//       if (err.code === 'auth/user-not-found') {
//         throw new Error('User not found');
//       } else if (err.code === 'auth/wrong-password') {
//         throw new Error('Incorrect password');
//       } else {
//         throw new Error('Invalid credentials');
//       }
//     }
//   }

//   logout(): void {
//     signOut(this.auth);
//     localStorage.removeItem('user');
//   }

//   getUser(): LoggedUser | null {
//     return JSON.parse(localStorage.getItem('user') || 'null');
//   }

//   isLoggedIn(): boolean {
//     return !!this.getUser();
//   }

//   isAdmin(): boolean {
//     return this.getUser()?.role === 'admin';
//   }
// }
