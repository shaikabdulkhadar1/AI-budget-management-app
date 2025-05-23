import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScreenProps } from "./types";

export default function InsightsScreen({ navigation }: ScreenProps) {
  return (
    <ScrollView style={styles.container}>
      {/* AI Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Icon name="psychology" size={24} color="#007AFF" />
          <Text style={styles.summaryTitle}>AI Financial Summary</Text>
        </View>
        <Text style={styles.summaryText}>
          Based on your spending patterns, you're on track to save 15% more this
          month compared to last month. Your food delivery expenses have
          decreased by 20%.
        </Text>
      </View>

      {/* Spending Trends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending Trends</Text>
        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Icon name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.trendTitle}>Positive Trends</Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendItemTitle}>Food & Dining</Text>
            <Text style={styles.trendItemValue}>↓ 20% from last month</Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendItemTitle}>Entertainment</Text>
            <Text style={styles.trendItemValue}>↓ 15% from last month</Text>
          </View>
        </View>

        <View style={[styles.trendCard, styles.warningCard]}>
          <View style={styles.trendHeader}>
            <Icon name="warning" size={24} color="#FF9500" />
            <Text style={styles.trendTitle}>Areas of Concern</Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendItemTitle}>Shopping</Text>
            <Text style={styles.trendItemValue}>↑ 30% from last month</Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendItemTitle}>Transportation</Text>
            <Text style={styles.trendItemValue}>↑ 25% from last month</Text>
          </View>
        </View>
      </View>

      {/* AI Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Smart Recommendations</Text>
        <View style={styles.recommendationCard}>
          <Icon
            name="lightbulb"
            size={24}
            color="#007AFF"
            style={styles.recommendationIcon}
          />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>
              Optimize Your Shopping
            </Text>
            <Text style={styles.recommendationText}>
              Consider consolidating your shopping trips to reduce
              transportation costs. You could save up to $50 this month.
            </Text>
          </View>
        </View>

        <View style={styles.recommendationCard}>
          <Icon
            name="savings"
            size={24}
            color="#4CAF50"
            style={styles.recommendationIcon}
          />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>Savings Opportunity</Text>
            <Text style={styles.recommendationText}>
              Your current spending pattern suggests you could increase your
              emergency fund by $200 this month.
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Comparison</Text>
        <View style={styles.comparisonCard}>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>This Month</Text>
            <Text style={styles.comparisonValue}>$2,500</Text>
            <Text style={styles.comparisonChange}>↓ 10%</Text>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Last Month</Text>
            <Text style={styles.comparisonValue}>$2,800</Text>
            <Text style={styles.comparisonChange}>↑ 5%</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="refresh" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Update Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Icon name="history" size={24} color="#666" />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            View History
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  summaryCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  trendCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  trendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  trendItemTitle: {
    fontSize: 16,
    color: "#333",
  },
  trendItemValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4CAF50",
  },
  recommendationCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  comparisonCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  comparisonItem: {
    flex: 1,
    alignItems: "center",
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  comparisonLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  comparisonChange: {
    fontSize: 14,
    color: "#4CAF50",
  },
  actionButtons: {
    flexDirection: "row",
    margin: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#666",
  },
});
