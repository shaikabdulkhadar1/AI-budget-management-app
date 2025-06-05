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

export interface TransactionFormData {
  amount: number;
  description: string;
  category: string;
  type: "expense" | "income";
}
