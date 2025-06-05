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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../contexts/AuthContext";
import { ScreenProps } from "./types";
import { transactionService } from "../services/transactionService";
import { Transaction } from "../types/transaction";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency, formatDate } from "../utils/formatters";
import { userService, UserDetails } from "../services/userService";

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

export default function DashboardScreen({ navigation }: ScreenProps) {
  const { session, signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

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

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionCategory}>
          {getCategoryName(item.category)}
        </Text>
        <Text style={styles.transactionDescription}>{item.description}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionDate}>{formatDate(item.timestamp)}</Text>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.type === "income" ? "#4CAF50" : "#FF3B30" },
          ]}
        >
          {formatCurrency(item.amount)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{getUserName()}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Icon name="account-circle" size={40} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(totalBalance)}
          </Text>
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Icon name="arrow-downward" size={20} color="#4CAF50" />
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="arrow-upward" size={20} color="#FF3B30" />
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("AddTransaction")}
          >
            <Icon name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Add Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Budget")}
          >
            <Icon name="account-balance-wallet" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Insights")}
          >
            <Icon name="insights" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Insights</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Transactions")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="receipt" size={48} color="#999" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first transaction to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id || item.timestamp}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  profileButton: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: "#007AFF",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  balanceLabel: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  balanceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "white",
    opacity: 0.8,
    fontSize: 14,
    marginTop: 4,
  },
  statValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    width: "30%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionText: {
    color: "#007AFF",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  seeAllText: {
    color: "#007AFF",
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  transactionInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  transactionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 90,
  },
  transactionDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  logoutButton: {
    marginRight: 16,
  },
});
