import { 
  doc, 
  collection, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where,
  serverTimestamp,
  DocumentData,
  QueryConstraint
} from "firebase/firestore";
import { db } from "./firebase";
import { logActivity } from "./activityLogger";

export interface DatabaseRecord {
  id?: string;
  [key: string]: any;
}

// Generic database service for CRUD operations
export class DatabaseService<T extends DatabaseRecord> {
  private collectionName: string;
  
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  
  // Get all documents from a collection with optional query constraints
  async getAll(constraints?: QueryConstraint[]): Promise<T[]> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const q = constraints ? query(collectionRef, ...constraints) : query(collectionRef);
      const querySnapshot = await getDocs(q);
      
      const results: T[] = [];
      querySnapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      
      return results;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}:`, error);
      throw error;
    }
  }
  
  // Get a single document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
  
  // Create a new document with auto-generated ID
  async create(data: Omit<T, 'id'>, userId?: string): Promise<T> {
    try {
      const collectionRef = collection(db, this.collectionName);
      
      // Add timestamps
      const dataWithTimestamp = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collectionRef, dataWithTimestamp);
      const newItem = { id: docRef.id, ...data } as T;
      
      // Log activity if userId is provided
      if (userId) {
        await logActivity({
          userId,
          action: `Created ${this.collectionName}`,
          details: `Created new ${this.collectionName.slice(0, -1)}`,
          entityId: docRef.id,
          entityType: this.collectionName
        });
      }
      
      return newItem;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }
  
  // Create a document with a specific ID
  async createWithId(id: string, data: Omit<T, 'id'>, userId?: string): Promise<T> {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Add timestamps
      const dataWithTimestamp = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, dataWithTimestamp);
      const newItem = { id, ...data } as T;
      
      // Log activity if userId is provided
      if (userId) {
        await logActivity({
          userId,
          action: `Created ${this.collectionName}`,
          details: `Created new ${this.collectionName.slice(0, -1)} with ID: ${id}`,
          entityId: id,
          entityType: this.collectionName
        });
      }
      
      return newItem;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
  
  // Update an existing document
  async update(id: string, data: Partial<T>, userId?: string): Promise<T> {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp as DocumentData);
      
      // Get the updated document
      const updatedDocSnap = await getDoc(docRef);
      const updatedItem = { id, ...updatedDocSnap.data() } as T;
      
      // Log activity if userId is provided
      if (userId) {
        await logActivity({
          userId,
          action: `Updated ${this.collectionName}`,
          details: `Updated ${this.collectionName.slice(0, -1)} with ID: ${id}`,
          entityId: id,
          entityType: this.collectionName
        });
      }
      
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
  
  // Delete a document
  async delete(id: string, userId?: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      
      // Log activity if userId is provided
      if (userId) {
        await logActivity({
          userId,
          action: `Deleted ${this.collectionName}`,
          details: `Deleted ${this.collectionName.slice(0, -1)} with ID: ${id}`,
          entityId: id,
          entityType: this.collectionName
        });
      }
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
} 