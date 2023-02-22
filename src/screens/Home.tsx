import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { Text, TopNav, useTheme, themeColor , TextInput} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";
import ListarUsuario from "./ListarUsuario";
import { firestore } from "../../firebase";
import { Usuario } from "../../model/Usuario";

export default function ({ navigation }) {
  const [search, setSearch] = useState("");
  const [like, setLike] = useState(false);
  const [dadosFiltrados, setdadosFiltrados] = useState([]);
  const modalizeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const [usuarios, setUsuarios] = useState([]);

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
        setdadosFiltrados(usuarios);
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

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
          <Text  style={styles.itemStylee}>{item.nome} </Text>
          <Text style={styles.itemStyle}>{item.descricao} </Text>
          <Pressable>
          <Ionicons
        
        name="heart"
        size={30}
        color={"#EF8F86"}
        style={{position:"relative", marginTop:5}}
        onPress={() => {
          setLike(true);
        }}
      />
          </Pressable>
          
        </View>
      </View>
    );
  };

  function onOpen() {
    modalizeRef.current?.open();
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "white" }}>
        <Text> </Text>
        <Text> </Text>
      </View>
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
      <ScrollView style={{marginTop:10}}>
        <View style={{margin:5}}>
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
        
      <ScrollView
        style={{ marginTop: 15 }}
        directionalLockEnabled={false}
        horizontal={true}
      >
        <Image
          style={styles.image1}
          source={require("../../assets/promo.png")}
        />
        <Image
          style={styles.image1}
          source={require("../../assets/promo.png")}
        />
        <Image
          style={styles.image1}
          source={require("../../assets/promo.png")}
        />
      </ScrollView>
      <FlatList
        data={dadosFiltrados}
        keyExtractor={(item) => item.id}
        //  ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
      {/*<ListarUsuario />*/}
      </ScrollView>
    </View>

  );
}
const styles = StyleSheet.create({
  image1: {
    width: 320,
    height: 220,
    borderRadius: 20,
    borderColor: "#ef846c",
    marginRight: 10,
  },
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
    padding: 0,
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
  //  flexDirection: "column",
  //  justifyContent: "flex-start",
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
