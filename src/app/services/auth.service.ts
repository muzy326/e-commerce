import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, map } from 'rxjs';
import { User } from '../models/user.model';
import {
  doc,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // 🔐 LOGIN
  validate(email: string, password: string) {

    const usersRef = collection(this.firestore, 'user');

    const q = query(
      usersRef,
      where('email', '==', email),
      where('password', '==', password)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as User)
        }));

        if (users.length > 0) {
          const user = users[0];

          localStorage.setItem('loggedInUserId', user.id ?? '');
          localStorage.setItem('displayName', user.displayName ?? '');
          localStorage.setItem('isAdmin', String(user.isAdmin ?? false));
        }

        return users;
      })
    );
  }

  // 📝 REGISTER
  register(user: User) {
    const usersRef = collection(this.firestore, 'user');
    return from(addDoc(usersRef, user));
  }

  // 👤 HELPERS
  get displayName(): string | null {
    return localStorage.getItem('displayName');
  }

  get loggedInUserId(): string | null {
    return localStorage.getItem('loggedInUserId');
  }

  get isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }
  resetPassword(email: string, newPassword: string) {

  const usersRef = collection(this.firestore, 'user');

  const q = query(
    usersRef,
    where('email', '==', email)
  );

  return from(
    getDocs(q).then(async snapshot => {

      if (snapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = snapshot.docs[0];

      await updateDoc(
        doc(this.firestore, 'user', userDoc.id),
        {
          password: newPassword
        }
      );

      return true;

    })
  );

}

  // 🚪 LOGOUT
  logout() {
    localStorage.clear();
  }
}
