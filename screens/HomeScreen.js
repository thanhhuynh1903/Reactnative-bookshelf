import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Card } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const isFocused = useIsFocused(); // Check if the screen is focused

  const getArtData = async () => {
    try {
      const response = await fetch(
        "https://66ed176d380821644cdb4c2b.mockapi.io/api"
      );
      const json = await response.json();
      setData(json);

      const uniqueBrands = [...new Set(json.map((item) => item.brand))];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    const storedFavorites = await AsyncStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  useEffect(() => {
    setSelectedBrand(null);
    getArtData();
    loadFavorites();
  }, [isFocused]);

  const toggleFavorite = async (item) => {
    const exists = favorites.some((fav) => fav.id === item.id);
    const newFavorites = exists
      ? favorites.filter((fav) => fav.id !== item.id)
      : [...favorites, item];

    // Update the state immediately for UI feedback
    setFavorites(newFavorites);

    // Update AsyncStorage
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const filteredData = selectedBrand
    ? data.filter((item) => item.brand === selectedBrand)
    : data;

  const searchedData = searchQuery
    ? filteredData.filter((item) =>
        item.artName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredData;

  const renderItem = ({ item }) => (
    <View style={{ flex: 1, maxWidth: "48%", marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Detail", {
            itemId: item.id,
            DetailInfo: item,
          });
        }}
      >
        <Card
          containerStyle={{
            height: 280,
            borderRadius: 20,
            backgroundColor: "#f5f5f5",
            borderWidth: 0,
            position: "relative",
            margin: 5,
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", zIndex: 5, top: 10, left: 10 }}
            onPress={() => toggleFavorite(item)}
          >
            <Ionicons
              name={
                favorites.some((fav) => fav.id === item.id)
                  ? "heart"
                  : "heart-outline"
              }
              color="#ea9f5a"
              size={23}
            />
          </TouchableOpacity>
          <Card.Image
            style={{ width: "100%", height: 100, resizeMode: "contain" }}
            source={{ uri: item.image }}
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Card.Title style={{ fontSize: 14, textAlign: "left" }}>
              {item.artName}
            </Card.Title>

            <Card.Title style={{ color: "#757D8A" }}>
              Deal: {item.limitedTimeDeal * 100}% off!
            </Card.Title>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flex: 1 }}>
            {/* Search Bar */}
            <TextInput
              style={{
                height: 40,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                marginHorizontal: 10,
                marginTop: 10,
              }}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />

            {/* Brand Filter */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity onPress={() => setSelectedBrand(null)}>
                <Text
                  style={{
                    color: selectedBrand === null ? "#ea9f5a" : "#000",
                    fontSize: 15,
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>
              {brands.map((brand, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedBrand(brand)}
                >
                  <Text
                    style={{
                      color: selectedBrand === brand ? "#ea9f5a" : "#000",
                      fontSize: 15,
                    }}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              contentContainerStyle={{
                paddingHorizontal: 5,
              }}
              data={searchedData}
              keyExtractor={({ id }) => id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 5,
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
