import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { budgetService, Budget } from "../services/budgetService";
import {
  transactionService,
  Transaction,
} from "../services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatters";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase/config";

type IconName = keyof typeof Ionicons.glyphMap;

interface Category {
  id: string;
  name: string;
  icon: IconName;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", icon: "fast-food", color: "#D8A48F" },
  { id: "transport", name: "Transportation", icon: "car", color: "#A3BCCC" },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "film",
    color: "#D4CFC9",
  },
  { id: "shopping", name: "Shopping", icon: "cart", color: "#B8C6C6" },
  {
    id: "bills",
    name: "Bills & Utilities",
    icon: "document-text",
    color: "#A7A4D6",
  },
  { id: "health", name: "Health & Fitness", icon: "fitness", color: "#D3A4A4" },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BudgetScreen: React.FC = () => {
  const { session } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Generate years (current year - 2 to current year + 2)
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  const calculateSpentAmount = (category: string) => {
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

    console.log(`Calculating spent amount for ${category} between:`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      transactionsCount: transactions.length,
    });

    const categoryTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.timestamp);
      const isInDateRange =
        transactionDate >= startDate && transactionDate <= endDate;
      const isMatchingCategory = transaction.category === category;
      const isExpense = transaction.type === "expense";

      console.log(`Transaction ${transaction.id}:`, {
        date: transactionDate.toISOString(),
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
        isInDateRange,
        isMatchingCategory,
        isExpense,
      });

      return isInDateRange && isMatchingCategory && isExpense;
    });

    const spent = categoryTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    console.log(`Total spent for ${category}:`, spent);
    return spent;
  };

  const fetchTransactions = async () => {
    try {
      if (!session?.user?.uid) return;
      console.log("Fetching transactions for user:", session.user.uid);
      const fetchedTransactions = await transactionService.getTransactions(
        session.user.uid
      );
      console.log("Fetched transactions:", fetchedTransactions.length);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Alert.alert("Error", "Failed to fetch transactions");
    }
  };

  const fetchBudgets = async () => {
    try {
      if (!session?.user?.uid) return;

      setLoading(true);
      console.log("Fetching budgets for user:", session.user.uid);
      console.log("Selected month/year:", selectedMonth, selectedYear);

      const fetchedBudgets = await budgetService.getBudgets(
        session.user.uid,
        selectedMonth,
        selectedYear
      );
      console.log("Fetched budgets:", fetchedBudgets.length);

      // Update spent amounts based on current transactions
      const updatedBudgets = fetchedBudgets.map((budget) => {
        const spent = calculateSpentAmount(budget.category);
        console.log(
          `Updating budget ${budget.category} with spent amount:`,
          spent
        );
        return {
          ...budget,
          spent,
        };
      });

      setBudgets(updatedBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      Alert.alert("Error", "Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      // First fetch transactions
      await fetchTransactions();
      // Then fetch and update budgets with the latest transactions
      await fetchBudgets();
    } catch (error) {
      console.error("Error refreshing data:", error);
      Alert.alert("Error", "Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  // Set up real-time transaction listener
  useEffect(() => {
    if (!session?.user?.uid) return;

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

    console.log("Setting up transaction listener for period:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", session.user.uid),
      where("type", "==", "expense")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log(
        "Transaction snapshot received:",
        snapshot.docs.length,
        "documents"
      );
      const updatedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      setTransactions(updatedTransactions);

      // After transactions are set, re-calculate budgets
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) => {
          const spent = updatedTransactions
            .filter((transaction) => {
              const transactionDate = new Date(transaction.timestamp);
              const startDate = new Date(selectedYear, selectedMonth, 1);
              const endDate = new Date(
                selectedYear,
                selectedMonth + 1,
                0,
                23,
                59,
                59
              );
              return (
                transaction.category === budget.category &&
                transaction.type === "expense" &&
                transactionDate >= startDate &&
                transactionDate <= endDate
              );
            })
            .reduce((sum, transaction) => sum + transaction.amount, 0);

          return {
            ...budget,
            spent,
          };
        })
      );
    });

    return () => {
      console.log("Cleaning up transaction listener");
      unsubscribe();
    };
  }, [session?.user?.uid, selectedMonth, selectedYear]);

  // Fetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Budget screen focused, refreshing data");
      // Set loading state to show loading indicator
      setLoading(true);

      // Fetch fresh data
      const loadData = async () => {
        try {
          // First fetch transactions
          await fetchTransactions();
          // Then fetch and update budgets with the latest transactions
          await fetchBudgets();
        } catch (error) {
          console.error("Error refreshing data on focus:", error);
          Alert.alert("Error", "Failed to refresh data");
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [session?.user?.uid, selectedMonth, selectedYear])
  );

  const handleAddBudget = async () => {
    try {
      if (!session?.user?.uid) return;
      if (!selectedCategory || !budgetAmount) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      // Check for duplicate category
      const isDuplicate = budgets.some(
        (budget) => budget.category === selectedCategory
      );

      if (isDuplicate) {
        Alert.alert(
          "Duplicate Category",
          `A budget for ${
            getCategoryDetails(selectedCategory).name
          } already exists for this month.`,
          [{ text: "OK" }]
        );
        return;
      }

      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }

      await budgetService.addBudget(session.user.uid, {
        category: selectedCategory,
        amount,
        month: selectedMonth,
        year: selectedYear,
      });

      setShowAddModal(false);
      setSelectedCategory("");
      setBudgetAmount("");
      fetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
      Alert.alert("Error", "Failed to add budget");
    }
  };

  const getCategoryDetails = (categoryId: string) => {
    return (
      CATEGORIES.find((cat) => cat.id === categoryId) || {
        name: categoryId,
        color: "#999999",
        icon: "help-circle" as IconName,
      }
    );
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A8FB9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={["#4C6EF5"]}
            tintColor="#4C6EF5"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Budget</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshData}
                disabled={refreshing}
              >
                <Ionicons
                  name="refresh"
                  size={24}
                  color="#FFFFFF"
                  style={[refreshing && styles.refreshingIcon]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.dateSelector}>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowMonthPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {MONTHS[selectedMonth]}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowYearPicker(true)}
              >
                <Text style={styles.dateButtonText}>{selectedYear}</Text>
                <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Budget Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="wallet-outline" size={24} color="#4C6EF5" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Total Budget</Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(totalBudget)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#FFF0F0" },
              ]}
            >
              <Ionicons name="trending-down" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={[styles.summaryAmount, { color: "#FF6B6B" }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#F0FFF4" },
              ]}
            >
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Remaining</Text>
              <Text style={[styles.summaryAmount, { color: "#4CAF50" }]}>
                {formatCurrency(remainingBudget)}
              </Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // Check if all categories are already used
                const availableCategories = CATEGORIES.filter(
                  (cat) => !budgets.some((budget) => budget.category === cat.id)
                );

                if (availableCategories.length === 0) {
                  Alert.alert(
                    "No Available Categories",
                    "You have already created budgets for all available categories this month.",
                    [{ text: "OK" }]
                  );
                  return;
                }

                setShowAddModal(true);
              }}
            >
              <Ionicons name="add-circle" size={24} color="#4C6EF5" />
              <Text style={styles.addButtonText}>Add Budget</Text>
            </TouchableOpacity>
          </View>

          {budgets.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="wallet-outline" size={48} color="#CCCCCC" />
              </View>
              <Text style={styles.emptyStateText}>
                No budgets set for this month
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.emptyStateButtonText}>
                  Create Your First Budget
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            budgets.map((budget) => {
              const category = getCategoryDetails(budget.category);
              const progress = (budget.spent / budget.amount) * 100;
              const isOverBudget = budget.spent > budget.amount;

              return (
                <View key={budget.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: category.color + "20" },
                        ]}
                      >
                        <Ionicons
                          name={category.icon}
                          size={24}
                          color={category.color}
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <Text
                      style={[
                        styles.categoryAmount,
                        isOverBudget && styles.overBudgetAmount,
                      ]}
                    >
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.amount)}
                    </Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: isOverBudget
                              ? "#FF6B6B"
                              : "#4C6EF5",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(progress)}%
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add Budget Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Budget</Text>
              <TouchableOpacity
                style={styles.closeIconButton}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {CATEGORIES.filter(
                  (cat) => !budgets.some((budget) => budget.category === cat.id)
                ).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryOption,
                      selectedCategory === category.id &&
                        styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <View
                      style={[
                        styles.categoryIconContainer,
                        { backgroundColor: category.color + "20" },
                      ]}
                    >
                      <Ionicons
                        name={category.icon}
                        size={24}
                        color={category.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryOptionText,
                        selectedCategory === category.id &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Budget Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={budgetAmount}
                  onChangeText={setBudgetAmount}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  (!selectedCategory || !budgetAmount) && styles.disabledButton,
                ]}
                onPress={handleAddBudget}
                disabled={!selectedCategory || !budgetAmount}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  Save Budget
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerTitle}>Select Month</Text>
            <ScrollView style={styles.pickerList}>
              {MONTHS.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.pickerItem,
                    selectedMonth === index && styles.selectedPickerItem,
                  ]}
                  onPress={() => {
                    setSelectedMonth(index);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedMonth === index && styles.selectedPickerItemText,
                    ]}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerTitle}>Select Year</Text>
            <ScrollView style={styles.pickerList}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.pickerItem,
                    selectedYear === year && styles.selectedPickerItem,
                  ]}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedYear === year && styles.selectedPickerItemText,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowYearPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#4C6EF5",
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: "row",
    gap: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  dateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4C6EF5",
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  overBudgetAmount: {
    color: "#FF6B6B",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    minWidth: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: "#4C6EF5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3A3A3A",
    letterSpacing: 0.3,
  },
  closeIconButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 12,
    letterSpacing: 0.25,
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FAFAFA",
    gap: 12,
    minWidth: "45%",
  },
  selectedCategory: {
    borderColor: "#4C6EF5",
    backgroundColor: "#F0F4FF",
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryOptionText: {
    fontSize: 15,
    color: "#4A4A4A",
    letterSpacing: 0.2,
    flex: 1,
  },
  selectedCategoryText: {
    color: "#4C6EF5",
    fontWeight: "600",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A4A4A",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#4A4A4A",
    paddingVertical: 14,
    letterSpacing: 0.25,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: "#4C6EF5",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    letterSpacing: 0.3,
  },
  saveButtonText: {
    color: "#FFFFFF",
  },
  pickerModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3A3A",
    marginBottom: 16,
    textAlign: "center",
  },
  pickerList: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  selectedPickerItem: {
    backgroundColor: "#4C6EF5",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#3A3A3A",
  },
  selectedPickerItemText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3A3A",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshingIcon: {
    opacity: 0.5,
  },
});

export default BudgetScreen;
