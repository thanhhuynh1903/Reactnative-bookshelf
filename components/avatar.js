import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Avatar = ({ letter }) => {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarLetter}>{letter?.[0].toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#ea9f5a', // Change to your desired color
    borderRadius: 20, // Half of width/height for circular shape
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Avatar;

