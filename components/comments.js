import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Avatar from "./avatar";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Comments({ item }) {

  return (
    <View style={{ padding: 20 }}>
      <Separator />
      <View style={{ backgroundColor: "#f1efe7" }}>
        <Text style={{ fontSize: 30, padding: 5, color: "#333" }}>
          Comments
        </Text>
      </View>
      <Separator />
      {item.comments.map((data, index) => (
        <View key={index} style={styles.commentContainer}>
          <Avatar letter={data.usename} />
          <View style={styles.commentContent}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>
              {data.usename}
            </Text>
            <Text style={styles.commentText}>{data.content}</Text>
            <Text style={styles.dateText}>{data.date}</Text>
            <Text style={styles.ratingText}>
              {Array(5)
                .fill()
                .map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < data.rating ? "star" : "star-outline"}
                    color="#ea9f5a"
                    size={16}
                  />
                ))}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const Separator = () => <View style={styles.stypeline} />;

const styles = StyleSheet.create({
  stypeline: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
  },
  commentContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "flex-start", // Align items to the start
    marginVertical: 10,
  },
  commentContent: {
    marginLeft: 10,
    flex: 1, // Allow the content to take available space
  },
  commentText: {
    fontSize: 16,
    color: "#333",
    flexWrap: "wrap", // Enable wrapping
  },
  ratingText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
});
