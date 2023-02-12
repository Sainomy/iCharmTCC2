import React, { useState, useEffect } from "react";
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
import Mapa from "../../src/components/utils/Mapa"
import MapView, { Marker } from "react-native-maps";


// import { clickProps } from "react-native-web/dist/cjs/modules/forwardedProps";
// import { nome } from "../screens/auth/Register";


export default function Profile({ navigation, route}) {
  const { isDarkmode, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [servico, setServico] = useState < Partial < Servico>> ({});
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });
  const [pickedImagePath, setPickedImagePath] = useState("");
  
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
  
  return (
    <Layout >
       <TopNav style={{position:"relative"}}
        middleContent={
          <Image
            source={require("../../assets/nome.png")}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        }
        leftContent={<Ionicons name="menu" size={30} color={isDarkmode ? themeColor.dark100 : "black"}/>}
      />
      <View style={{flex:0.03}}>
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
                navigation.navigate("editProfile");
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
     
          {usuario.urlfoto !== null && (
            <Image source={{ uri: usuario.urlfoto }} style={styles.image} />
          )}
          {usuario.urlfoto === null && (
            <Image
              source={require("../../assets/usuario.png")}
              style={styles.image}
            />
          )}
 {/* <Image source={{ uri: usuario.urlfoto }} style={styles.image}/>*/}
         
        <Text style={{ fontSize: 18, marginTop: 50, textAlign: "right", marginLeft:100,}}>
          {usuario.nome}
          </Text>
        <Text style={styles.text}>{usuario.numero}</Text>
        <Text style={styles.text}>{usuario.email}</Text>
        <Text style={{color: "gray", marginTop:20}}>Sobre:</Text>
        <Text style={styles.text2}>{usuario.descricao}</Text>
        <Button
              color="#EF8F86"
              text="Adicionar Endereço"
              rightContent={
                <Ionicons
                    name="locate"
                    size={20}
                    color={themeColor.white}
                />}
              onPress={() => {
                navigation.navigate("Endereco");
              }}
              style={{
                marginTop: 5,
                backgroundColor: "#E8A998",
              }}
            />
            <Button
              color="#EF8F86"
              text="Mapa"
              rightContent={
                <Ionicons
                    name="locate"
                    size={20}
                    color={themeColor.white}
                />}
              onPress={() => {
                navigation.navigate("Mapa");
              }}
              style={{
                marginTop: 5,
                backgroundColor: "#E8A998",
              }}
            />
             
        </View>
    </Layout>
    
  );
      }   
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //justifyContent: "center",
   // alignItems: "center",
   //marginTop:50,
    margin: 15,
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


