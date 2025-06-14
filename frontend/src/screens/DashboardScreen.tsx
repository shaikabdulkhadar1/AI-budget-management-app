import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../contexts/AuthContext";
import { ScreenProps } from "./types";
import { transactionService } from "../services/transactionService";
import { Transaction } from "../types/transaction";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency, formatDate } from "../utils/formatters";
import { userService, UserDetails } from "../services/userService";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  AddTransaction: { transaction?: Transaction };
  Transactions: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_NAMES: { [key: string]: string } = {
  food: "Food & Dining",
  rent: "Rent",
  transport: "Transportation",
  entertainment: "Entertainment",
  shopping: "Shopping",
  bills: "Bills & Utilities",
  health: "Health & Fitness",
  groceries: "Groceries",
  other: "Others",
  salary: "Salary",
  freelance: "Freelancing",
  investment: "Investment",
  bonus: "Bonus",
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { session, signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month"); // Changed default to month
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchUserDetails = async () => {
    try {
      if (!session?.user?.uid) {
        console.log("No user session found");
        return;
      }

      console.log("Fetching user details for:", session.user.uid);
      const details = await userService.getUserDetails(session.user.uid);
      console.log("Fetched user details:", details);
      setUserDetails(details);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!session?.user?.uid) {
        console.log("No user session found");
        return;
      }

      console.log("Fetching transactions for user:", session.user.uid);
      const data = await transactionService.getTransactions(session.user.uid);
      console.log("Fetched transactions:", data);
      setTransactions(data);

      // Calculate totals
      const income = data
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = data
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      console.log("Calculated totals:", {
        income,
        expenses,
        balance: income - expenses,
      });
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setTotalBalance(income - expenses);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Dashboard screen focused, fetching data");
      fetchUserDetails();
      fetchTransactions();
    }, [session?.user?.uid])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserDetails();
    fetchTransactions();
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getUserName = () => {
    if (userDetails?.firstName && userDetails?.lastName) {
      return `${userDetails.firstName}`;
    }
    return session?.user?.email?.split("@")[0] || "User";
  };

  const getCategoryName = (categoryId: string) => {
    return CATEGORY_NAMES[categoryId] || categoryId;
  };

  const getPeriodTransactions = () => {
    const now = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter(
      (transaction) => new Date(transaction.timestamp) >= startDate
    );
  };

  const periodTransactions = getPeriodTransactions();
  const totalIncomePeriod = periodTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesPeriod = periodTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balancePeriod = totalIncomePeriod - totalExpensesPeriod;

  const handleDeleteTransaction = async (transactionId: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (!session?.user?.uid) return;
              await transactionService.deleteTransaction(transactionId);
              fetchTransactions();
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Alert.alert("Error", "Failed to delete transaction");
            }
          },
        },
      ]
    );
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const handleUpdateTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      if (!session?.user?.uid) return;
      await transactionService.updateTransaction(selectedTransaction.id, {
        ...selectedTransaction,
        amount: Number(selectedTransaction.amount),
      });
      setIsEditModalVisible(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert("Error", "Failed to update transaction");
    }
  };

  const renderRightActions = (transaction: Transaction) => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editAction}
          onPress={() => handleEditTransaction(transaction)}
        >
          <View style={styles.actionContent}>
            <Ionicons name="pencil" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = (transaction: Transaction) => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => handleDeleteTransaction(transaction.id)}
        >
          <View style={styles.actionContent}>
            <Ionicons name="trash" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransaction = (transaction: Transaction) => (
    <Swipeable
      renderRightActions={() => renderRightActions(transaction)}
      renderLeftActions={() => renderLeftActions(transaction)}
    >
      <View style={styles.transactionCard}>
        <View style={styles.transactionInfo}>
          <View
            style={[
              styles.transactionIcon,
              {
                backgroundColor:
                  transaction.type === "income" ? "#4CAF5020" : "#FF6B6B20",
              },
            ]}
          >
            <Ionicons
              name={transaction.type === "income" ? "arrow-down" : "arrow-up"}
              size={24}
              color={transaction.type === "income" ? "#4CAF50" : "#FF6B6B"}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {transaction.description}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(transaction.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: transaction.type === "income" ? "#4CAF50" : "#FF6B6B",
            },
          ]}
          numberOfLines={1}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.userName}>{getUserName()}</Text>
              <View style={styles.periodSelector}>
                {["month", "year"].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodButton,
                      selectedPeriod === period && styles.selectedPeriodButton,
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        selectedPeriod === period && styles.selectedPeriodText,
                      ]}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="wallet-outline" size={24} color="#4C6EF5" />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Balance</Text>
                <Text style={styles.summaryAmount}>
                  {formatCurrency(balancePeriod)}
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
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={[styles.summaryAmount, { color: "#4CAF50" }]}>
                  {formatCurrency(totalIncomePeriod)}
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
                <Text style={styles.summaryLabel}>Expenses</Text>
                <Text style={[styles.summaryAmount, { color: "#FF6B6B" }]}>
                  {formatCurrency(totalExpensesPeriod)}
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  navigation.navigate("AddTransaction");
                }}
              >
                <Ionicons name="add-circle" size={24} color="#4C6EF5" />
              </TouchableOpacity>
            </View>

            {periodTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons name="receipt-outline" size={48} color="#CCCCCC" />
                </View>
                <Text style={styles.emptyStateText}>
                  No transactions for this period
                </Text>
              </View>
            ) : (
              <>
                {periodTransactions.slice(0, 5).map((transaction) => (
                  <View key={transaction.id}>
                    {renderTransaction(transaction)}
                  </View>
                ))}
                {periodTransactions.length > 5 && (
                  <TouchableOpacity
                    style={styles.showAllButton}
                    onPress={() => navigation.navigate("Transactions")}
                  >
                    <Text style={styles.showAllText}>
                      Show All Transactions
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#4C6EF5"
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Transaction</Text>
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              {selectedTransaction && (
                <View style={styles.modalBody}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Amount</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedTransaction.amount.toString()}
                      onChangeText={(text) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          amount: Number(text) || 0,
                        })
                      }
                      keyboardType="numeric"
                      placeholder="Enter amount"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedTransaction.description}
                      onChangeText={(text) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          description: text,
                        })
                      }
                      placeholder="Enter description"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.categoryContainer}>
                      <TouchableOpacity
                        style={[
                          styles.categoryButton,
                          selectedTransaction.type === "income" &&
                            styles.selectedCategory,
                        ]}
                        onPress={() =>
                          setSelectedTransaction({
                            ...selectedTransaction,
                            type: "income",
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            selectedTransaction.type === "income" &&
                              styles.selectedCategoryText,
                          ]}
                        >
                          Income
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.categoryButton,
                          selectedTransaction.type === "expense" &&
                            styles.selectedCategory,
                        ]}
                        onPress={() =>
                          setSelectedTransaction({
                            ...selectedTransaction,
                            type: "expense",
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            selectedTransaction.type === "expense" &&
                              styles.selectedCategoryText,
                          ]}
                        >
                          Expense
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdateTransaction}
                  >
                    <Text style={styles.updateButtonText}>
                      Update Transaction
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
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
  welcomeText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: "row",
    gap: 12,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedPeriodButton: {
    backgroundColor: "#FFFFFF",
  },
  periodButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedPeriodText: {
    color: "#4C6EF5",
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
  transactionsContainer: {
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
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4C6EF5",
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#666666",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 90,
    textAlign: "right",
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
  },
  logoutButton: {
    marginRight: 16,
  },
  showAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  showAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4C6EF5",
    marginRight: 4,
  },
  actionContainer: {
    width: 100,
    height: "100%",
  },
  editAction: {
    backgroundColor: "#4C6EF5",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  deleteAction: {
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  actionContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  selectedCategory: {
    backgroundColor: "#4C6EF5",
    borderColor: "#4C6EF5",
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  updateButton: {
    backgroundColor: "#4C6EF5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DashboardScreen;
