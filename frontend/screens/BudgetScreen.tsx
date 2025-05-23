import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScreenProps } from "./types";

const months = [
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const budgetCategories = [
  {
    id: 1,
    name: "Food & Dining",
    icon: "restaurant",
    spent: 450,
    budget: 600,
    color: "#FF6B6B",
  },
  {
    id: 2,
    name: "Transportation",
    icon: "directions-car",
    spent: 200,
    budget: 300,
    color: "#4ECDC4",
  },
  {
    id: 3,
    name: "Entertainment",
    icon: "movie",
    spent: 100,
    budget: 200,
    color: "#FFD93D",
  },
  {
    id: 4,
    name: "Shopping",
    icon: "shopping-bag",
    spent: 300,
    budget: 400,
    color: "#95E1D3",
  },
  {
    id: 5,
    name: "Bills & Utilities",
    icon: "receipt",
    spent: 800,
    budget: 1000,
    color: "#6C5CE7",
  },
  {
    id: 6,
    name: "Health & Fitness",
    icon: "fitness-center",
    spent: 150,
    budget: 200,
    color: "#FF8B94",
  },
];

export default function BudgetScreen({ navigation }: ScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const handleEditBudget = (category) => {
    setEditingCategory(category);
    setEditAmount(category.budget.toString());
  };

  const saveBudget = () => {
    // Here you would typically update the budget in your state management
    setEditingCategory(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Month and Year Selector */}
      <View style={styles.dateSelector}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setShowYearDropdown(false);
              setShowMonthDropdown(!showMonthDropdown);
            }}
          >
            <Text style={styles.dropdownButtonText}>
              {months[selectedMonth]}
            </Text>
            <Icon
              name={showMonthDropdown ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
          {showMonthDropdown && (
            <View style={[styles.dropdownList, styles.monthDropdown]}>
              <ScrollView
                style={styles.dropdownScroll}
                showsVerticalScrollIndicator={false}
              >
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.dropdownItem,
                      selectedMonth === index && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedMonth(index);
                      setShowMonthDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedMonth === index &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.dropdownGradient} />
            </View>
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => {
              setShowMonthDropdown(false);
              setShowYearDropdown(!showYearDropdown);
            }}
          >
            <Text style={styles.dropdownButtonText}>{selectedYear}</Text>
            <Icon
              name={showYearDropdown ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
          {showYearDropdown && (
            <View style={[styles.dropdownList, styles.yearDropdown]}>
              <ScrollView
                style={styles.dropdownScroll}
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.dropdownItem,
                      selectedYear === year && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedYear(year);
                      setShowYearDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedYear === year &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.dropdownGradient} />
            </View>
          )}
        </View>
      </View>

      {/* Monthly Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Monthly Overview</Text>
        <View style={styles.overviewStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Budget</Text>
            <Text style={styles.statValue}>$2,700</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Spent</Text>
            <Text style={styles.statValue}>$2,000</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={[styles.statValue, styles.remainingValue]}>$700</Text>
          </View>
        </View>
      </View>

      {/* Budget Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Categories</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {budgetCategories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + "20" },
                  ]}
                >
                  <Icon name={category.icon} size={24} color={category.color} />
                </View>
                <View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryProgress}>
                    ${category.spent} / ${category.budget}
                  </Text>
                </View>
              </View>
              <View style={styles.categoryActions}>
                <Text
                  style={[
                    styles.percentageText,
                    {
                      color:
                        category.spent / category.budget > 0.9
                          ? "#FF6B6B"
                          : "#4CAF50",
                    },
                  ]}
                >
                  {Math.round((category.spent / category.budget) * 100)}%
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditBudget(category)}
                >
                  <Icon name="edit" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (category.spent / category.budget) * 100,
                      100
                    )}%`,
                    backgroundColor: category.color,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Edit Budget Modal */}
      <Modal
        visible={editingCategory !== null}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Budget for {editingCategory?.name}
            </Text>
            <TextInput
              style={styles.input}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              placeholder="Enter new budget amount"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingCategory(null)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveBudget}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  overviewCard: {
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
  overviewTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "white",
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  remainingValue: {
    color: "#4CAF50",
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "#007AFF",
    marginLeft: 4,
    fontWeight: "600",
  },
  categoryCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  categoryProgress: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  dateSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    gap: 8,
    zIndex: 1000,
  },
  dropdownContainer: {
    flex: 1,
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dropdownList: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1001,
    width: "100%",
    maxHeight: 250,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "white",
    opacity: 0.9,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 40,
  },
  dropdownItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemTextSelected: {
    color: "#007AFF",
    fontWeight: "500",
  },
  categoryActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  saveButtonText: {
    color: "white",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  monthDropdown: {
    top: "100%",
    left: 0,
  },
  yearDropdown: {
    top: "100%",
    right: 0,
  },
});
