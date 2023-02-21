import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-rapi-ui";
import { firestore } from "../../firebase";


export default function ListarUsuario({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [usuarios, setUsuarios] = useState ([]);
 
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .onSnapshot((querySnapshot) => {
        const usuarios = [];
        querySnapshot.forEach((documentSnapshot) => {
          usuarios.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setUsuarios(usuarios);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

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
          <Text style={styles.itemStyle}>{item.descricao} </Text>
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
    <FlatList
    data={usuarios}
    keyExtractor={(item) => item.id}
    //  ItemSeparatorComponent={ItemSeparatorView}
    renderItem={ItemView}
  />
    
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
