import { supabase } from "./config";
import { Database } from "./types";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

export const updateProfile = async (
  userId: string,
  updates: Database["public"]["Tables"]["profiles"]["Update"]
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  return { data, error };
};

export const getTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const addTransaction = async (
  transaction: Database["public"]["Tables"]["transactions"]["Insert"]
) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();
  return { data, error };
};
