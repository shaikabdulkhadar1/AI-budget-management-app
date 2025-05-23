import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ExpenseCard({
  title,
  amount,
}: {
  title: string;
  amount: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 14,
    color: "#555",
  },
});
