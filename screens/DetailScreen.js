import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import Comments from "../components/comments";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailScreen({ route, navigation }) {
  const { itemId, DetailInfo } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const ArrayLength = DetailInfo.comments.length;
  const totalRatings =
    DetailInfo.comments.reduce((sum, data) => sum + data.rating, 0) / ArrayLength;

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          const favoritesArray = JSON.parse(storedFavorites);
          setIsFavorite(favoritesArray.some((fav) => fav.id === itemId));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadFavorites();
  }, [itemId]);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
      if (isFavorite) {
        favoritesArray = favoritesArray.filter((fav) => fav.id !== itemId);
      } else {
        favoritesArray.push(DetailInfo);
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#FFF", height: "100%" }}>
      <View style={{ width: "100%", height: 400, backgroundColor: "#FFF" }}>
        <Image
          source={{ uri: DetailInfo.image }}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </View>
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{DetailInfo.artName}</Text>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#757D8A" }}>
          Brand: {DetailInfo.brand}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#2F3239" }}>
          Description: {DetailInfo.description}
        </Text>
        <View style={styles.container}>
          <View style={styles.priceCard}>
            <LinearGradient
              colors={[
                "rgba(112,246,255,0.33)",
                "rgba(221,108,241,0.26)",
                "rgba(229,106,253,0.71)",
                "rgba(123,183,253,1)",
              ]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="arrow-up-circle" size={24} color="black" />
              </View>
              <Text style={{fontSize: 18, color: "grey",textDecorationLine: "line-through"}}>${DetailInfo.price}.00</Text>
              <Text style={styles.price}>
                ${(DetailInfo.price - DetailInfo.price * DetailInfo.limitedTimeDeal).toFixed(2)}
              </Text>
              <View style={styles.extraOfferContainer}>
                <Text style={styles.extraOffer}>
                  Extra {DetailInfo.limitedTimeDeal}% off
                </Text>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Ionicons
                name={
                  DetailInfo.glassSurface ? "checkmark-circle" : "close-circle-outline"
                }
                size={24}
                color={DetailInfo.glassSurface ? "green" : "red"}
              />
              <Text style={styles.infoText}>Glass Surface</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="star" size={24} color="#ea9f5a" />
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>{totalRatings.toFixed(1)} star</Text> {""}|{" "}
                {ArrayLength} reviews
              </Text>
            </View>
            
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={toggleFavorite}
      >
        <Text style={styles.buttonText}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            color="#ea9f5a"
            size={23}
          />
          {isFavorite ? " Remove from" : " Add to"} favorite list
        </Text>
      </TouchableOpacity>
      <Comments item={DetailInfo} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gradientBox: {
    width: 170,
    height: 160,
    padding: 20,
    borderRadius: 20,
    justifyContent: "end",
    alignItems: "end",
  },
  gradientText: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
  },
  textDeal: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFF",
  },
  priceCard: {
    flex: 1,
    marginRight: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 1,
  },
  extraOfferContainer: {
    backgroundColor: "#FF4081",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  extraOffer: {
    color: "#FFF",
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  favoriteButton: {
    backgroundColor: "#f1efe7",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 21,
    color: "#333",
  },
});
