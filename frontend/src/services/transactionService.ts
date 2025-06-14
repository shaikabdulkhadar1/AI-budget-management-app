import { db } from "../lib/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface Transaction {
  id?: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  timestamp: string;
  createdAt: string;
}

export const transactionService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const transactionsQuery = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(transactionsQuery);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
    } catch (error) {
      console.error("Error getting transactions:", error);
      throw error;
    }
  },

  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt">
  ): Promise<Transaction> {
    try {
      const now = new Date().toISOString();
      const transactionData = {
        ...transaction,
        createdAt: now,
      };

      console.log("Adding transaction:", transactionData);
      const docRef = await addDoc(
        collection(db, "transactions"),
        transactionData
      );
      console.log("Transaction added with ID:", docRef.id);

      return {
        id: docRef.id,
        ...transactionData,
      };
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  async updateTransaction(
    transactionId: string,
    transaction: Transaction
  ): Promise<void> {
    try {
      const transactionRef = doc(db, "transactions", transactionId);
      await updateDoc(transactionRef, {
        ...transaction,
        amount: Number(transaction.amount),
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },
};
