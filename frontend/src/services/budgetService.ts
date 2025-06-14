import { db } from "../lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export interface Budget {
  id?: string;
  userId: string;
  category: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  category: string;
  amount: number;
  month: number;
  year: number;
}

class BudgetService {
  private collection = "userBudgets";

  async getBudgets(
    userId: string,
    month: number,
    year: number
  ): Promise<Budget[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where("userId", "==", userId),
        where("month", "==", month),
        where("year", "==", year)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Budget)
      );
    } catch (error) {
      console.error("Error fetching budgets:", error);
      throw error;
    }
  }

  async addBudget(userId: string, data: BudgetFormData): Promise<Budget> {
    try {
      const budgetData = {
        userId,
        ...data,
        spent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, this.collection), budgetData);
      return {
        id: docRef.id,
        ...budgetData,
      };
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error;
    }
  }

  async updateBudget(
    budgetId: string,
    data: Partial<BudgetFormData>
  ): Promise<void> {
    try {
      const budgetRef = doc(db, this.collection, budgetId);
      await updateDoc(budgetRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  }

  async deleteBudget(budgetId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, budgetId));
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  }
}

export const budgetService = new BudgetService();
