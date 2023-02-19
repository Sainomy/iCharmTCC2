import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Layout, Text, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "../../../firebase";
import { ScrollView } from "react-native-gesture-handler";

export default function Mapa({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [enderecos, setEnderecos] = useState([]);
  const [defaultRating, setDefaultRating] = useState(2);
  // const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Endereco")
      .onSnapshot((querySnapshot) => {
        const enderecos = [];
        querySnapshot.forEach((documentSnapshot) => {
          enderecos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setEnderecos(enderecos);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const ItemView = ({ item }) => {
    return (
      <View style={styles.alinhamentoLinha}>
        <Ionicons
          style={{ alignItems: "center", padding: 30 }}
          name="map"
          size={20}
          color={"gray"}
        />

        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>
            {item.rua}, {item.numero}
          </Text>
          <Text style={styles.itemStyle}>{item.bairro} </Text>
          <Text style={styles.itemStyle}>
            {item.cidade}, {item.uf}{" "}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      directionalLockEnabled={false}
      horizontal={true}
      vertical={false}
    >
      <FlatList
        numColumns={50}
        data={enderecos}
        keyExtractor={(item) => item.id}
        renderItem={ItemView}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
  },
  itemStylee: {
    fontSize: 15,
    padding: 5,
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 12,
    padding: 5,
    color: "gray",
  },
  alinhamentoLinha: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "white",
    margin: 12,
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  alinhamentoColuna: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 15,
  },

  // separador: {
  //   height: 1,
  //   width: "100%",
  // },
});
