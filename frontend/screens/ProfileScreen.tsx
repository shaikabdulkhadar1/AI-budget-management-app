import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ScreenProps } from "./types";

export default function ProfileScreen({ navigation }: ScreenProps) {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: "https://ui-avatars.com/api/?name=John+Doe&background=007AFF&color=fff&size=200",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Icon name="camera-alt" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Personal Information</Text>
            <Text style={styles.menuItemSubtitle}>
              Update your personal details
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="notifications" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Notifications</Text>
            <Text style={styles.menuItemSubtitle}>
              Manage your notifications
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="security" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Security</Text>
            <Text style={styles.menuItemSubtitle}>
              Password and security settings
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="language" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Language</Text>
            <Text style={styles.menuItemSubtitle}>English (US)</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="attach-money" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Currency</Text>
            <Text style={styles.menuItemSubtitle}>USD ($)</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="dark-mode" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Theme</Text>
            <Text style={styles.menuItemSubtitle}>Light</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Support & About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & About</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Help & Support</Text>
            <Text style={styles.menuItemSubtitle}>
              Get help and contact support
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info" size={24} color="#007AFF" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>About</Text>
            <Text style={styles.menuItemSubtitle}>Version 1.0.0</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Icon name="logout" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  logoutText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
