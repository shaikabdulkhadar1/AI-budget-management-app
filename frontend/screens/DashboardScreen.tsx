import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>$2,450.00</Text>
        <View style={styles.balanceStats}>
          <View style={styles.statItem}>
            <Icon name="arrow-upward" size={20} color="#4CAF50" />
            <Text style={styles.statText}>Income: $3,200</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="arrow-downward" size={20} color="#F44336" />
            <Text style={styles.statText}>Expenses: $750</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="add" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="remove" size={24} color="#F44336" />
          <Text style={styles.actionText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionList}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Icon name="shopping-cart" size={24} color="#007AFF" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Grocery Shopping</Text>
                <Text style={styles.transactionDate}>Today, 2:30 PM</Text>
              </View>
              <Text style={styles.transactionAmount}>-$45.00</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Budget Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        <View style={styles.budgetList}>
          {[
            { category: "Food & Dining", spent: 450, budget: 600 },
            { category: "Transportation", spent: 200, budget: 300 },
            { category: "Entertainment", spent: 100, budget: 200 },
          ].map((item, index) => (
            <View key={index} style={styles.budgetItem}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetCategory}>{item.category}</Text>
                <Text style={styles.budgetAmount}>
                  ${item.spent} / ${item.budget}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(item.spent / item.budget) * 100}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  balanceCard: {
    backgroundColor: "#007AFF",
    padding: 20,
    margin: 16,
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
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 8,
  },
  balanceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "white",
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionText: {
    marginLeft: 8,
    color: "#333",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
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
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  transactionList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  budgetList: {
    gap: 16,
  },
  budgetItem: {
    gap: 8,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetCategory: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  budgetAmount: {
    fontSize: 14,
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
});
