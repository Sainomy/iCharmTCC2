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
  SafeAreaView,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { Text, TopNav, useTheme, themeColor , TextInput, Button} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";
import { firestore } from "../../firebase";
import { Usuario } from "../../model/Usuario";

export default function ({ navigation }) {
  const [search, setSearch] = useState("");
  const [close, setClose] = useState(false);
  const [dadosFiltrados, setdadosFiltrados] = useState([]);
  const modalizeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [favoritos, setFavoritos] = useState([ ]);

  useEffect(() => {
    const subscriber = firestore
    .collection("Usuario")
    .where("pro", "==", true)
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
     // setClose(true);
    } else {
      setdadosFiltrados(usuarios);
      setSearch(text);
    //  setClose(true);
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

  const ItemViewFav = ({ item }) => {
    return (
      <View style={{alignItems:"center"}}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            //Abrir({servicoID:item.id})
            navigation.navigate("ProfileView", { userID: item.id })
          }>
          <Image style={{width: 50,
            height: 50,
            borderRadius: 150 / 2,}} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>
        <View >
          <Text style={{fontSize: 10, padding: 5}}>{item.nome}</Text>      
        </View>  
      </View>
    );
  };

  function onOpen() {
    modalizeRef.current?.open();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkmode ? themeColor.dark100 : "white" }}>
      <TopNav
        style={{ borderColor: isDarkmode ? themeColor.dark100 : "white" }}
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
        rightContent={
          <Ionicons
            name="notifications-outline"
            size={25}
            color={"black"}
          />}
          rightAction={() => navigation.navigate("Notificacoes")}
      />
      <Modalize ref={modalizeRef} snapPoint={220}>
        <View
          style={{
            flex: 1,
            height: 220,
           
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
              marginTop: 25,
              marginHorizontal: 30,
              marginVertical: 6,
              alignItems:"center"
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
              marginTop: 2,
              marginHorizontal: 30,
              marginVertical: 6,
              alignItems:"center"
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
              marginTop: 2,
              marginHorizontal: 30,
              marginVertical: 6,
              alignItems:"center"
            }}
          >
            <Text style={{ color: "red" }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
      <View style={{margin:10}}>
      <TextInput
          borderRadius={15}
          onChangeText={(text) => {searchFilter(text); setClose(true);}}
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
      {close === false && (
          
            
        
      <ScrollView style={{marginTop:5}}>
       
        
      <ScrollView
        style={{ marginTop: 5 }}
        directionalLockEnabled={false}
        horizontal={true}
      >
       
        <Image
          style={styles.image1}
          source={require("../../assets/4.png")}
        />
        <Image
          style={styles.image1}
          source={require("../../assets/3.png")}
        />
        <Image
          style={styles.image1}
          source={require("../../assets/2.png")}
        />
        
      </ScrollView>
      <Text fontWeight="light" style={{marginTop: 5, fontSize:18}}>  <Ionicons
              name="heart"
              size={20}
              color={"#EF8F86"}
            />Favoritos</Text>
        <ScrollView
  style={{ flex: 1, marginTop:5, marginVertical:5 }}
  directionalLockEnabled={false}
  horizontal={true}>
    <FlatList
     numColumns={2}
    data={favoritos}
    keyExtractor={(item) => item.id}
    //  ItemSeparatorComponent={ItemSeparatorView}
    renderItem={ItemViewFav}
  />
   </ScrollView>
   <Text fontWeight="light" style={{marginTop: 5, fontSize:18}}>  <Ionicons
              name="list"
              size={20}
              color={"#EF8F86"}
            />Categorias</Text>
      <View style={{margin:10}}>
        
      <ScrollView
       
        directionalLockEnabled={false}
        horizontal={true}
      >
        
     <TouchableOpacity onPress={() =>
    navigation.navigate("Maquiagem")
          } style={{alignItems:"center", marginRight: 15}}>
    <Image
          style={{width: 50,
            height: 50,
            borderRadius: 150 / 2,
             }}
          source={require("../../assets/make.png")}
          />
          
        <Text style={{fontSize:10}}>Maquiagem</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigation.navigate("Cabelo")
          }  style={{alignItems:"center", marginRight: 15}}>
          <Image
          style={{width: 50,
            height: 50,
            borderRadius: 150 / 2,
             }}
          source={require("../../assets/cabelo.png")}
          />
          
        <Text style={{fontSize:10}}>Cabelo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigation.navigate("Unha")
          }  style={{alignItems:"center", marginRight: 15}}>
          <Image
          style={{width: 50,
            height: 50,
            borderRadius: 150 / 2,
             }}
          source={require("../../assets/unha.png")}
          />
          
        <Text style={{fontSize:10}}>Unhas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigation.navigate("Cilios")
          }  style={{alignItems:"center", marginRight: 15}}>
          <Image
          style={{width: 50,
            height: 50,
            borderRadius: 150 / 2,
             }}
          source={require("../../assets/cilios.png")}
          />
          
        <Text style={{fontSize:10}}>Cilíos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigation.navigate("Pele")
          }  style={{alignItems:"center", marginRight: 15}}>
          <Image
          style={{width: 50,
            height: 50,
            borderRadius: 150 / 2,
             }}
          source={require("../../assets/pele.png")}
          />
          
        <Text style={{fontSize:10}}>Limpeza Facial</Text>
          </TouchableOpacity>
          
          </ScrollView>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        //  ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
      </View>
      
      {/*<ListarUsuario />*/}
      </ScrollView>
        )}
        {close === true && (
          <ScrollView>
 <FlatList
 data={dadosFiltrados}
 keyExtractor={(item) => item.id}
 //  ItemSeparatorComponent={ItemSeparatorView}
 renderItem={ItemView}
/>
 <TouchableOpacity
 activeOpacity={0.7}
 onPress={() => {
  setClose(false);
 }} style={{alignItems:"center"}}>
  <Text style={{marginTop:10}}>Voltar ao ínicio</Text>
 <Ionicons name="arrow-back" size={40} color={"black"} style={{ width: 70,height: 70, padding:10}}/>
</TouchableOpacity>
</ScrollView>
        )}

    </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  image1: {
    width: 320,
    height: 180,
    borderRadius: 5,
    borderColor: "#ef846c",
    marginRight: 10,
  },
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

  // separador: {
  //   height: 1,
  //   width: "100%",
  // },
});
