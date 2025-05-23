import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import screens
import DashboardScreen from "./screens/DashboardScreen";
import BudgetScreen from "./screens/BudgetScreen";
import InsightsScreen from "./screens/InsightsScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

function FloatingButton({ onPress }) {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <TouchableOpacity
      style={[styles.floatingButton, isPressed && styles.floatingButtonPressed]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Icon name="add" size={24} color="white" />
    </TouchableOpacity>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState("Dashboard");

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          id={undefined}
          screenOptions={{
            tabBarActiveTintColor: "#007AFF",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              height: 60,
              paddingBottom: 15,
            },
            headerShown: true,
          }}
          screenListeners={{
            state: (e) => {
              const currentRoute = e.data.state.routes[e.data.state.index];
              setCurrentScreen(currentRoute.name);
            },
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="dashboard" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Budget"
            component={BudgetScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="account-balance-wallet" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="AI Insights"
            component={InsightsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="insights" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="person" size={24} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        {currentScreen !== "Dashboard" && <FloatingButton onPress={() => {}} />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#007AFF",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "row",
    paddingHorizontal: 16,
    width: "auto",
  },
  floatingButtonPressed: {
    backgroundColor: "#0056b3",
    transform: [{ scale: 0.95 }],
  },
  floatingButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
