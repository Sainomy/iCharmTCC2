import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { Text, TopNav, useTheme, themeColor, TextInput, } from "react-native-rapi-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { Usuario } from "../../../model/Usuario";
import { ScrollView } from "react-native-gesture-handler";
import { Notificacao } from "../../../model/Notificacao";
import { listAll } from "firebase/storage";
import { Agendamento } from "../../../model/Agendamento";

export default function Cilios({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [dadosFiltrados, setdadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [usuarios, setUsuarios] = useState([]);
  const [pickedImagePath, setPickedImagePath] = useState("");
 
  useEffect(() => {
    const subscriber = firestore
    .collection("Usuario")
    .where("cilios", "==", true)
      .onSnapshot((querySnapshot) => {
        const usuarios = [];
        querySnapshot.forEach((documentSnapshot) => {
          usuarios.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setUsuarios(usuarios);
      
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [usuarios]);
  const searchFilter = (text) => {
    if (text) {
      const newData = usuarios.filter(function (item) {
        if (item.nome) {
          const itemData = item.nome.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
      setdadosFiltrados(newData);
      setSearch(text);
    } else {
      setdadosFiltrados(usuarios);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
        <View style={styles.alinhamentoLinha}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            //Abrir({servicoID:item.id})
            navigation.navigate("ProfileView", { userID: item.id })
          }
        >
          <Image style={styles.image} source={{ uri: item.urlfoto }}  />
        </TouchableOpacity>

        <View style={styles.alinhamentoColuna}>
          
          <View style={{flexDirection:"row"}}>
          <Text  style={styles.itemStylee}>{item.nome} </Text>
          <Text style={styles.itemStylee}>{item.curtida}</Text>
          <Ionicons
            name="heart"
            size={30}
            color={"#EF8F86"}
            style={{position:"relative", marginTop:5}}
           
          />
          </View>
          <Text style={styles.itemStylee1}>{item.descricao} </Text>
         
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:"white"}}>
    <TopNav
    middleContent={
        <Text style={{margin:15}}>C I L Í O S </Text>
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
<Image
        style={{width: 40,
          height: 40,
          borderRadius: 150 / 2,
        
           }}
        source={require("../../../assets/cilios.png")}
        />
    }></TopNav>
    <ScrollView>
        

<View style={{ alignItems:"center", marginTop:15}}>
<TextInput
          borderRadius={15}
          onChangeText={(text) => searchFilter(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Procure Aqui"
          rightContent={
            <Ionicons
              name="search"
              size={20}
              color={themeColor.gray300}
            />
          }
        />

   
     
        </View>

        <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        //  ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
   </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
  },
  itemStylee1: {
    fontSize: 12,
    padding: 5,
    marginTop: 2,
  },
  itemStylee: {
    fontSize: 20,
    padding: 5,
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 18,
    padding: 0,
    color: "green",
  },
  alinhamentoLinha: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: "#d3d3d3",
    borderWidth:0.5
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
});
