import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post, Destination, Book, Author, Certificate } from '../types';

export class DatabaseService {
  // Posts CRUD operations
  static async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  static async updatePost(id: string, updates: Partial<Post>): Promise<void> {
    await updateDoc(doc(db, 'posts', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  static async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(db, 'posts', id));
  }

  static async getPost(id: string): Promise<Post | null> {
    const docSnap = await getDoc(doc(db, 'posts', id));
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Post;
  }

  static async getPosts(
    category?: string,
    limitCount: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (category) {
      q = query(
        collection(db, 'posts'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Post;
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    return { posts, lastDoc: lastVisible };
  }

  static async getFeaturedPosts(): Promise<Post[]> {
    const q = query(
      collection(db, 'posts'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Post;
    });
  }

  // Destinations CRUD operations
  static async createDestination(destination: Omit<Destination, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'destinations'), destination);
    return docRef.id;
  }

  static async updateDestination(id: string, updates: Partial<Destination>): Promise<void> {
    await updateDoc(doc(db, 'destinations', id), updates);
  }

  static async deleteDestination(id: string): Promise<void> {
    await deleteDoc(doc(db, 'destinations', id));
  }

  static async getDestination(id: string): Promise<Destination | null> {
    const docSnap = await getDoc(doc(db, 'destinations', id));
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Destination;
  }

  static async getDestinationsByRegion(region?: string): Promise<Destination[]> {
    let q = query(collection(db, 'destinations'), orderBy('name'));

    if (region) {
      q = query(
        collection(db, 'destinations'),
        where('region', '==', region),
        orderBy('name')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Destination));
  }

  // Book CRUD operations
  static async updateBook(updates: Partial<Book>): Promise<void> {
    await updateDoc(doc(db, 'book', 'main'), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  static async getBook(): Promise<Book | null> {
    const docSnap = await getDoc(doc(db, 'book', 'main'));
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      publishDate: data.publishDate.toDate(),
    } as Book;
  }

  // Author CRUD operations
  static async updateAuthor(updates: Partial<Author>): Promise<void> {
    await updateDoc(doc(db, 'author', 'main'), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  static async getAuthor(): Promise<Author | null> {
    const docSnap = await getDoc(doc(db, 'author', 'main'));
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Author;
  }

  // Certificates CRUD operations
  static async createCertificate(certificate: Omit<Certificate, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'certificates'), certificate);
    return docRef.id;
  }

  static async updateCertificate(id: string, updates: Partial<Certificate>): Promise<void> {
    await updateDoc(doc(db, 'certificates', id), updates);
  }

  static async deleteCertificate(id: string): Promise<void> {
    await deleteDoc(doc(db, 'certificates', id));
  }

  static async getCertificates(): Promise<Certificate[]> {
    const q = query(collection(db, 'certificates'), orderBy('year', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Certificate));
  }

  // Search functionality
  static async searchContent(searchTerm: string): Promise<{
    posts: Post[];
    destinations: Destination[];
  }> {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Search posts
    const postsQuery = query(collection(db, 'posts'));
    const postsSnapshot = await getDocs(postsQuery);
    const posts = postsSnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Post;
      })
      .filter(post => 
        post.title.toLowerCase().includes(searchTermLower) ||
        post.excerpt.toLowerCase().includes(searchTermLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );

    // Search destinations
    const destinationsQuery = query(collection(db, 'destinations'));
    const destinationsSnapshot = await getDocs(destinationsQuery);
    const destinations = destinationsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Destination))
      .filter(dest => 
        dest.name.toLowerCase().includes(searchTermLower) ||
        dest.description.toLowerCase().includes(searchTermLower)
      );

    return { posts, destinations };
  }
}
