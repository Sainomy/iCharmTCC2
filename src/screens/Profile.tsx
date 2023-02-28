import { useRoute} from "@react-navigation/core";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity
} from "react-native";
// import firebaseConfig from "./firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
// const app = firebase.initializeApp(firebaseConfig);
import { auth, firestore, storage } from "../../firebase";
//import { doc, getDoc } from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage"; //access the storage database
import * as ImagePicker from "expo-image-picker";
import { Usuario } from "../../model/Usuario";
import { Servico } from "../../model/Servico"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Layout, TopNav, Button, Text,  useTheme,
  themeColor,} from "react-native-rapi-ui";
//import ListarServico from "./service/ListarServico";
import Mapa from "../screens/utils/Mapa"
import MapView, { Marker } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import MeusServicos from "./service/MeusServicos";

export default function Profile({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [addhr, setAddhr] = useState(true);
  const modalizeRef = useRef(null);
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  const [servicos, setServicos] = useState([]); // Initial empty array of users
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });
  const [pickedImagePath, setPickedImagePath] = useState("");
  const route = useRoute();
  const editado = (route.params); 
  
  {  /*if (editado == null) {
      setAddhr(false);
    } else {
      setAddhr(true);
    };*/}
  
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        setUsuario(documentSnapshot.data());
        if (usuario.urlfoto == null) {
          setPickedImagePath("");
        } else {
          setPickedImagePath(usuario.urlfoto);
        };
       
      });
    return () => subscriber();
  }, [usuario]);

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
          <Image style={styles.image1} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>

        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>{item.nomecat}</Text>
          <Text style={styles.itemStyle}>R${item.valor} </Text>
        </View>
      </View>
    );
  };
 
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
       <TopNav style={{position:"relative"}}
        middleContent={
          <Image
            source={require("../../assets/nome.png")}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        }
      />
      <ScrollView >
      <View style={{margin:10}}>
      <Button
              color="#EF8F86"
              rightContent={
                <Ionicons
                    name="create"
                    size={20}
                    color={themeColor.white}
                />}
              text="Editar "
              onPress={() => {
                navigation.navigate("EditProfile");
              }}
              style={{
                position: "absolute",
                backgroundColor: "#E8A998",
                right:1,
                margin:10,
              }}
            />
      </View>
    
    <View style={styles.screen}>
     
          {usuario.urlfoto !== "" && (
            <Image source={{ uri: usuario.urlfoto }} style={styles.image} />
          )}
          {usuario.urlfoto === "" && (
            <Image
              source={require("../../assets/usuario.png")}
              style={styles.image}
            />
          )}
         
        
        <Text style={{ fontSize: 18, marginTop: 50, textAlign: "right", marginLeft:100,}}>
          {usuario.nome}
          </Text>
          {usuario.pro === true && (
            <Text style={{color: "gray", textAlign: "right", marginLeft:100,}}>Profissional</Text>
            
          )}
        <Text style={styles.text}>{usuario.numero}</Text>
        <Text style={styles.text}>{usuario.email}</Text>
        {addhr === true && (
             <Button
             color="#EF8F86"
             style={{ marginTop: 20 }}
             text="Editar Horários"
             onPress={() => {
               navigation.navigate("AddHorarios");
             }}
           />
          )}
          {addhr === null && (
             <Button
             color="#EF8F86"
             style={{ marginTop: 20 }}
             text="Personalizar Horários"
             onPress={() => {
               navigation.navigate("AddHorarios");
             }}
           />
          )}
       
        <Text style={{color: "gray", marginTop:20}}>Sobre:</Text>
        <Text style={styles.text2}>{usuario.descricao}</Text>

        <Text>Endereços</Text>
        <ScrollView
        style={{ flex: 1 }}
        directionalLockEnabled={false}
        horizontal={true}>
        <Mapa />
        <Ionicons
        name="add-circle"
        size={40}
        color={"black"}
        style={{ alignItems: "center", padding: 30 }}
        onPress={() => {
          navigation.navigate("Endereco");
        }}
      />
      
        </ScrollView>
          {/*  <Button
              color="#EF8F86"
              style={{ marginTop: 20 }}
              text="Serviços"
              onPress={() => {
                navigation.navigate("ListarServico", { userID: auth.currentUser.uid });
              }}
            />*/}
{/*<MeusServicos />*/}
<FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          //  ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
           
            {usuario.pro === true && (
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("AddServico");
            }} style={{alignItems:"center"}}>
            <Ionicons name="add-circle" size={60} color={"#EF8F86"} style={{ width: 70,height: 70,}}/>
          </TouchableOpacity>
          )}
            
        </View>
        </ScrollView>
    </SafeAreaView>
    
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
    borderColor: "#d3d3d3",
    borderWidth:0.5
  },
  alinhamentoColuna: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  screen: {
    flex: 1,
    //justifyContent: "center",
   // alignItems: "center",
   //marginTop:50,
   margin: 15,
  },
  image1: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 15,
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "blue",
  },
  imageContainer: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
    position:"absolute", 
    left:10,
  },
  text: {
    fontSize: 15,
    marginTop: 10,
    textAlign: "right",
    
    position:"relative"
  },
  text2: {
    fontSize: 15,
    marginTop: 10,
    textAlign: "left",
  },
    texts: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
});


