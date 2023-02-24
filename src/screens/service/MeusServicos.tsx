{/*import React from "react";
import { useNavigation, useRoute} from "@react-navigation/core";
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
import { Usuario } from "../../../model/Usuario";


export default function MeusServicos({ navigation}) {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [servicos, setServicos] = useState([]); // Initial empty array of users
 
  useEffect(() => {
  
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .onSnapshot((querySnapshot) => {
        const servicos = [];
        querySnapshot.forEach((documentSnapshot) => {
          servicos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setServicos(servicos);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const ItemView = ({ item }) => {
    return (
      <View style={styles.alinhamentoLinha}>
        <TouchableOpacity
          activeOpacity={0.7}
        onPress={()=>//Abrir({servicoID:item.id}) 
                navigation.navigate("TelaServico", { servicoID: item.id, userpro:item.pro })
           }
        >
          <Image style={styles.image} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>

        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>{item.nomecat}</Text>
          <Text style={styles.itemStyle}>R${item.valor} </Text>
        </View>
      </View>
    );
  };
  return (
  
    <View style={{marginTop:50}}>
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          //  ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={35}  />
          </Pressable>
          </View>
  
  );
}

const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
  },
  container: {},
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
});*/}
