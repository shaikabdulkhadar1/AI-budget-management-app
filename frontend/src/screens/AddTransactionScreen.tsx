import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScreenProps } from "./types";
import { transactionService } from "../services/transactionService";
import { auth } from "../lib/firebase/config";

const expenseCategories = [
  { id: "food", name: "Food & Dining", icon: "restaurant" },
  { id: "transport", name: "Transportation", icon: "directions-car" },
  { id: "rent", name: "Rent", icon: "home" },
  { id: "entertainment", name: "Entertainment", icon: "movie" },
  { id: "shopping", name: "Shopping", icon: "shopping-bag" },
  { id: "bills", name: "Bills & Utilities", icon: "receipt" },
  { id: "health", name: "Health & Fitness", icon: "fitness-center" },
  { id: "groceries", name: "Groceries", icon: "shopping-cart" },
  { id: "other", name: "Others", icon: "more-horiz" },
];

const incomeCategories = [
  { id: "salary", name: "Salary", icon: "work" },
  { id: "freelance", name: "Freelancing work", icon: "laptop" },
  { id: "investment", name: "Investment", icon: "trending-up" },
  { id: "bonus", name: "Bonus", icon: "stars" },
  { id: "other", name: "Others", icon: "more-horiz" },
];

export default function AddTransactionScreen({ navigation }: ScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );

  const categories = useMemo(() => {
    return transactionType === "income" ? incomeCategories : expenseCategories;
  }, [transactionType]);

  const handleSubmit = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No authenticated user found");
        Alert.alert("Error", "Please log in to add transactions");
        return;
      }

      if (!amount || !description || !selectedCategory) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }

      const transactionData = {
        userId: currentUser.uid,
        type: transactionType,
        amount: amountValue,
        description,
        category: selectedCategory,
        timestamp: new Date().toISOString(),
      };

      console.log("Adding transaction for user:", currentUser.uid);
      console.log("Transaction data:", transactionData);

      await transactionService.addTransaction(transactionData);

      // Clear form
      setAmount("");
      setDescription("");
      setSelectedCategory("");
      setTransactionType("expense");

      // Show success message
      Alert.alert("Success", "Transaction added successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "Failed to add transaction. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Add Transaction</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Transaction Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === "income" && styles.selectedIncomeType,
              ]}
              onPress={() => setTransactionType("income")}
            >
              <Icon
                name="arrow-downward"
                size={24}
                color={transactionType === "income" ? "#fff" : "#4CAF50"}
              />
              <Text
                style={[
                  styles.typeText,
                  transactionType === "income" && styles.selectedTypeText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === "expense" && styles.selectedExpenseType,
              ]}
              onPress={() => setTransactionType("expense")}
            >
              <Icon
                name="arrow-upward"
                size={24}
                color={transactionType === "expense" ? "#fff" : "#FF3B30"}
              />
              <Text
                style={[
                  styles.typeText,
                  transactionType === "expense" && styles.selectedTypeText,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#999"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="What's this for?"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Icon
                    name={category.icon}
                    size={24}
                    color={
                      selectedCategory === category.id ? "#fff" : "#007AFF"
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id &&
                        styles.selectedCategoryText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!amount || !description || !selectedCategory) &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!amount || !description || !selectedCategory}
          >
            <Text style={styles.submitButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  typeSelector: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    gap: 8,
  },
  selectedIncomeType: {
    backgroundColor: "#4CAF50",
  },
  selectedExpenseType: {
    backgroundColor: "#FF3B30",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  selectedTypeText: {
    color: "#fff",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "600",
    color: "#000",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    minWidth: 150,
  },
  inputContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: "#000",
    padding: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    width: "30%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  selectedCategory: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
