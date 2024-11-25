// screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
//npm install expo-image-picker if it having error

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, City",
    profileImage: null,
  });
  const [editedData, setEditedData] = useState({ ...userData });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
        setEditedData(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["userToken", "userData"]);
            navigation.replace("Login");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(editedData));
      setUserData(editedData);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert("Error", "Failed to save profile updates");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry, we need camera roll permissions to change your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setEditedData({ ...editedData, profileImage: result.assets[0].uri });
    }
  };

  const ProfileField = ({ label, value, onChangeText, editable = true }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={isEditing ? pickImage : null}
        >
          {userData.profileImage ? (
            <Image
              source={{
                uri: isEditing
                  ? editedData.profileImage
                  : userData.profileImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person-outline" size={50} color="#666" />
            </View>
          )}
          {isEditing && (
            <View style={styles.editOverlay}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={24} color="tomato" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.content}>
        <ProfileField
          label="Full Name"
          value={isEditing ? editedData.name : userData.name}
          onChangeText={(text) => setEditedData({ ...editedData, name: text })}
        />

        <ProfileField
          label="Email"
          value={isEditing ? editedData.email : userData.email}
          onChangeText={(text) => setEditedData({ ...editedData, email: text })}
          editable={false}
        />

        <ProfileField
          label="Phone"
          value={isEditing ? editedData.phone : userData.phone}
          onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
        />

        <ProfileField
          label="Address"
          value={isEditing ? editedData.address : userData.address}
          onChangeText={(text) =>
            setEditedData({ ...editedData, address: text })
          }
        />

        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setEditedData(userData);
                setIsEditing(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "tomato",
    padding: 8,
    borderRadius: 15,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  content: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#333",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "tomato",
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButtonText: {
    color: "tomato",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
