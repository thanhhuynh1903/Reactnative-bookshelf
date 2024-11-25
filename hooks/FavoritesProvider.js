// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const FavoritesContext = createContext();

// export const FavoritesProvider = ({ children }) => {
//   const [favorites, setFavorites] = useState([]);

//   const loadFavorites = async () => {
//     try {
//       const storedFavorites = await AsyncStorage.getItem('favorites');
//       console.log(storedFavorites);
//       console.log(favorites);
//       if (storedFavorites) {
//         setFavorites(JSON.parse(storedFavorites));
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const saveFavorites = async (newFavorites) => {
//     try {
//       await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const toggleFavorite = (id, artName, price, image) => {
//     const exists = favorites.some(fav => fav.id === id);
//     let newFavorites;

//     if (exists) {
//       newFavorites = favorites.filter(fav => fav.id !== id);
//     } else {
//       newFavorites = [...favorites, { id, artName, price, image }];
//     }

//     setFavorites(newFavorites);
//     saveFavorites(newFavorites);
//   };

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   return (
//     <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
//       {children}
//     </FavoritesContext.Provider>
//   );
// };
