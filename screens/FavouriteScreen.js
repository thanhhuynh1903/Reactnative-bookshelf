import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Card } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isEditMode, setEditMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const isFocused = useIsFocused();

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        // Update showDeleteAll based on favorites length when loading
        setShowDeleteAll(parsedFavorites.length > 2);
      } else {
        setFavorites([]);
        setShowDeleteAll(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (item) => {
    const newFavorites = favorites.filter((fav) => fav.id !== item.id);
    if (newFavorites.length === favorites.length) {
      newFavorites.push(item);
    }
    setFavorites(newFavorites);
    setShowDeleteAll(newFavorites.length > 2);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const toggleSelectionForDeletion = (item) => {
    const newSelectedForDeletion = selectedForDeletion.includes(item.id)
      ? selectedForDeletion.filter((id) => id !== item.id)
      : [...selectedForDeletion, item.id];

    setSelectedForDeletion(newSelectedForDeletion);
  };

  const confirmDeletion = () => {
    if (selectedForDeletion.length === 0) {
      Alert.alert("Nothing to delete");
      return;
    }
    Alert.alert(
      "Confirm Deletion",
      `Do you want to delete ${selectedForDeletion.length} selected favorite product${selectedForDeletion.length > 1 ? 's' : ''}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteFavorites(),
          style: "destructive",
        },
      ]
    );
  };

  const confirmDeletionAll = () => {
    if (favorites.length <= 2) {
      Alert.alert("Not enough items", "You need more than 2 items to use Delete All");
      return;
    }
    
    Alert.alert(
      "Delete All Favorites",
      `Are you sure you want to delete all ${favorites.length} favorite products? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete All",
          onPress: () => deleteAllFavorites(),
          style: "destructive",
        },
      ]
    );
  };

  const deleteFavorites = async () => {
    const newFavorites = favorites.filter(
      (item) => !selectedForDeletion.includes(item.id)
    );
    setFavorites(newFavorites);
    setSelectedForDeletion([]);
    setEditMode(false);
    setShowDeleteAll(newFavorites.length > 2);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const deleteAllFavorites = async () => {
    setFavorites([]);
    setSelectedForDeletion([]);
    setEditMode(false);
    setShowDeleteAll(false);
    await AsyncStorage.setItem("favorites", JSON.stringify([]));
  };

  useEffect(() => {
    if (isFocused) {
      setEditMode(false);
      setSelectedForDeletion([]);
      loadFavorites();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          if (isEditMode) {
            toggleSelectionForDeletion(item);
          } else {
            navigation.navigate("Detail", {
              itemId: item.id,
              DetailInfo: item,
            });
          }
        }}
      >
        <Card containerStyle={styles.cardContainer}>
          {isEditMode && (
            <TouchableOpacity
              style={{ position: "absolute", zIndex: 5 }}
              onPress={() => toggleSelectionForDeletion(item)}
            >
              <Ionicons
                name={
                  selectedForDeletion.includes(item.id)
                    ? "heart-outline"
                    : "heart"
                }
                color="#ea9f5a"
                size={23}
              />
            </TouchableOpacity>
          )}
          <Card.Image style={styles.image} source={{ uri: item.image }} />
          <View style={styles.cardContent}>
            <Card.Title style={styles.artName}>{item.artName}</Card.Title>
            <Card.Title>Deal: {item.limitedTimeDeal}% off!</Card.Title>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                marginTop: 5,
              }}
            >
              <Card.Title
                style={{
                  fontSize: 15,
                  color: "#ea9f5a",
                  textDecorationLine: "line-through",
                }}
              >
                ${item.price}
              </Card.Title>
              <Card.Title style={{ fontSize: 15, color: "red" }}>
                ${(item.price - item.price * item.limitedTimeDeal).toFixed(2)}
              </Card.Title>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            {isEditMode ? (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditMode(false);
                    setSelectedForDeletion([]);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    selectedForDeletion.length === 0 && styles.disabledButton,
                  ]}
                  onPress={confirmDeletion}
                  disabled={selectedForDeletion.length === 0}
                >
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
                {favorites.length > 2 && (
                  <TouchableOpacity
                    style={styles.deleteAllButton}
                    onPress={confirmDeletionAll}
                  >
                    <Text style={styles.buttonText}>Delete All</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={[
                  styles.editButton,
                  (favorites.length === 0 || !favorites) && styles.disabledButton,
                ]}
                onPress={() => setEditMode(true)}
                disabled={favorites.length === 0 || !favorites}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          ) : (
            <Text style={styles.emptyMessage}>No favorites added yet.</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#ea9f5a",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteAllButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  card: {
    width: "50%",
  },
  cardContainer: {
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 0,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  cardContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-between",
    marginTop: 10,
  },
  artName: {
    fontSize: 13,
  },
  price: {
    fontSize: 15,
    color: "#ea9f5a",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default FavoritesScreen;
