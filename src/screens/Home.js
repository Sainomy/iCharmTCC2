import React from "react";
import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Linking,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";
import ListarUsuario from "./ListarUsuario";

export default function ({ navigation }) {
  const modalizeRef = useRef(null);
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();

  function onOpen() {
    modalizeRef.current?.open();
  }
  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <Image
          style={{
            width: 210,
            height: 150,
            borderRadius: 20,
            resizeMode: "cover",
            borderColor: "#ef846c",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
          require={"../../assets/promo.png"}
        />
      </TouchableOpacity>
    );
  };
  return (
    <Layout>
      <TopNav
        style={{ borderColor: isDarkmode ? themeColor.dark100 : "#E6E6E6" }}
        middleContent={
          <Image
            source={require("../../assets/nome.png")}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        }
        leftContent={
          <Ionicons
            name="menu"
            size={30}
            color={isDarkmode ? themeColor.dark100 : "black"}
          />
        }
        leftAction={onOpen}
      />
      <Modalize ref={modalizeRef} snapPoint={180}>
        <View
          style={{
            flex: 1,
            height: 180,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (isDarkmode) {
                setTheme("light");
              } else {
                setTheme("dark");
              }
            }}
            style={{
              backgroundColor: isDarkmode ? themeColor.dark100 : "white",
              borderRadius: 6,
              padding: 15,
              borderWidth: 1,
              borderColor: "rgba(0,0,0, 0.2)",
              marginTop: 40,
              marginHorizontal: 15,
              marginVertical: 6,
            }}
          >
            <Text style={isDarkmode ? themeColor.dark100 : "white"}>
              {isDarkmode ? "Modo Claro" : "Modo Escuro"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UseDelete");
            }}
            style={{
              backgroundColor: isDarkmode ? themeColor.dark100 : "white",
              borderRadius: 6,
              padding: 15,
              borderWidth: 1,
              borderColor: "rgba(0,0,0, 0.2)",
              marginTop: 10,
              marginHorizontal: 15,
              marginVertical: 6,
            }}
          >
            <Text>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              signOut(auth);
            }}
            style={{
              backgroundColor: isDarkmode ? themeColor.dark100 : "white",
              borderRadius: 6,
              padding: 15,
              borderWidth: 1,
              borderColor: "rgba(0,0,0, 0.2)",
              marginTop: 10,
              marginHorizontal: 15,
              marginVertical: 6,
            }}
          >
            <Text style={{ color: "red" }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
      <ScrollView
        style={{ flex: 1, marginTop: 15 }}
        directionalLockEnabled={false}
        horizontal={true}
      >
        <Image
          style={styles.image}
          source={require("../../assets/promo.png")}
        />
        <Image
          style={styles.image}
          source={require("../../assets/promo.png")}
        />
        <Image
          style={styles.image}
          source={require("../../assets/promo.png")}
        />
      </ScrollView>
      <View
        style={{
          flex: 1,
          // alignItems: "center",
          // justifyContent: "center",
          margin: 15,
        }}
      >
        <ListarUsuario />
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 180,
    borderRadius: 20,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
