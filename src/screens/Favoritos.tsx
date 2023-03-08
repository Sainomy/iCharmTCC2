import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { Usuario } from "../../model/Usuario";

export default function Favoritos({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [favoritos, setFavoritos] = useState([ ]);
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  const [pickedImagePath, setPickedImagePath] = useState("");
 
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Favoritos")
      .onSnapshot((querySnapshot) => {
        const favoritos = [];
        querySnapshot.forEach((documentSnapshot) => {
          favoritos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setFavoritos(favoritos);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [favoritos]);

  const buscar = (item) => {
    useEffect(() => {
      const subscriber = firestore
        .collection("Usuario")
        .doc(item.id)
        .onSnapshot((documentSnapshot) => {
          setUsuario(documentSnapshot.data());
  
         
        });
      return () => subscriber();
    }, [usuario]);
  }
  

  const ItemView = ({ item }) => {
  
  
    return (
      // Flat List Item
      // coloca alinhamento em linha justificado flex-start
      <View style={styles.alinhamentoLinha}>
        <TouchableOpacity
          activeOpacity={0.7}

        >
          <Image style={styles.image} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>

        {/* // coloca alinhamento em coluna justificado flex-start */}
        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>{item.nome}</Text>
          <Text style={styles.itemStylee1}>{item.descricao} </Text>
          <Text>{usuario.nome}</Text>
          {/* fecha alinhamento colunas */}
          {/* <Stars stars={item.stars} showNumber={true} />*/}
          {/*  <RatingBar />*/}
          {/* <Text>
          {defaultRating} / {Math.max.apply(null, maxRating)}
    </Text>*/}
        </View>

        {/* fecha alinhamento linhas */}
      </View>
    );
  };


  return (
    <SafeAreaView style={{flex: 1, backgroundColor:"white"}}>
    <TopNav
    middleContent={
      <Image
        source={require("../../assets/nome.png")}
        style={{ width: 110, height: 110 }}
        resizeMode="contain"
      />
    }
    leftContent={
      <Ionicons
        name="chevron-back"
        size={20}
        color={isDarkmode ? themeColor.white100 : themeColor.black}
      />
    }
    leftAction={() => navigation.goBack()}
    rightContent={
      <Ionicons
        name="heart"
        size={25}
        color={"red"}
      />}
  ></TopNav>
    <FlatList
    data={favoritos}
    keyExtractor={(item) => item.id}
    //  ItemSeparatorComponent={ItemSeparatorView}
    renderItem={ItemView}
  />
   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
  },
  itemStylee: {
    fontSize: 20,
    padding: 5,
    marginTop: 2,
  },
  itemStylee1: {
    fontSize: 12,
    padding: 5,
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 18,
    padding: 5,
    color: "green",
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
