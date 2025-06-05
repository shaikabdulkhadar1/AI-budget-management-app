import "./src/lib/polyfills";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import screens
import DashboardScreen from "./src/screens/DashboardScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import InsightsScreen from "./src/screens/InsightsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AddTransactionScreen from "./src/screens/AddTransactionScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";

// Import context
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const [currentScreen, setCurrentScreen] = React.useState("Dashboard");

  return (
    <View style={styles.container}>
      <Stack.Navigator id={undefined}>
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {() => (
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
                    <Icon
                      name="account-balance-wallet"
                      size={24}
                      color={color}
                    />
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
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={CreateAccountScreen} />
    </Stack.Navigator>
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
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
});
