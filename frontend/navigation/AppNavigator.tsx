import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import InsightsScreen from "../screens/InsightsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Add " component={AddExpenseScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
