import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InsightsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Based Insights</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F6FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default InsightsScreen;
