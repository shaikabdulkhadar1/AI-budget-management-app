import "./src/lib/polyfills";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import screens
import DashboardScreen from "./screens/DashboardScreen";
import BudgetScreen from "./screens/BudgetScreen";
import InsightsScreen from "./screens/InsightsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";

// Import context
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

function TabNavigator() {
  const [currentScreen, setCurrentScreen] = React.useState("Dashboard");

  return (
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
  );
}

function Navigation() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
