import { db } from "../lib/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  monthlyBudget: number;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  async getUserDetails(userId: string): Promise<UserDetails | null> {
    try {
      const userDoc = await getDoc(doc(db, "userDetails", userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserDetails;
      }
      return null;
    } catch (error) {
      console.error("Error getting user details:", error);
      throw error;
    }
  },

  async createUserDetails(
    userId: string,
    userDetails: UserDetails
  ): Promise<void> {
    try {
      await setDoc(doc(db, "userDetails", userId), userDetails);
    } catch (error) {
      console.error("Error creating user details:", error);
      throw error;
    }
  },

  async updateUserDetails(
    userId: string,
    updates: Partial<UserDetails>
  ): Promise<void> {
    try {
      const userRef = doc(db, "userDetails", userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  },
};
