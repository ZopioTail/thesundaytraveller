import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User as AppUser } from '../types';

export class AuthService {
  static async signIn(email: string, password: string): Promise<User> {
    if (!auth) throw new Error('Firebase not configured');
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  static async signUp(email: string, password: string, displayName: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(result.user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: result.user.email,
      displayName,
      photoURL: result.user.photoURL,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return result.user;
  }

  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  static async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  static async getCurrentUser(): Promise<AppUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;

    return userDoc.data() as AppUser;
  }

  static onAuthStateChanged(callback: (user: User | null) => void) {
    if (!auth) {
      // Return a dummy unsubscribe function if auth is not available
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }

  static async updateUserProfile(updates: Partial<AppUser>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Update Firebase Auth profile
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.displayName,
        photoURL: updates.photoURL,
      });
    }

    // Update Firestore document
    await setDoc(doc(db, 'users', user.uid), {
      ...updates,
      updatedAt: new Date(),
    }, { merge: true });
  }

  static async checkAdminRole(uid: string): Promise<boolean> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data() as AppUser;
    return userData.role === 'admin';
  }
}
