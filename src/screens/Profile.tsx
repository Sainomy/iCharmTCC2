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
  const [nome, setNome] = useState(usuario.nome)
  const [email, setEmail] = useState("");
 // const [id, setId] = useState(route.params.id);
  const [data, setData] = useState("");
  const [numero, setNumero] = useState("");
  const [categoria, setCategoria] = useState("");
  
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
  
  function editTask(nome){
    const reference = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .update({
      id: auth.currentUser.uid,
      nome: setNome,
      email: email,
      numero: numero,
      categoria: categoria,
      data: data,
     // urlfoto: urlfoto,

    })
    navigation.navigate("Home")
  }

  const escolhefoto = () => {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
          style: "default",
        },

        {
          text: "Abrir galeria",
          onPress: () => showImagePicker(),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };
 
  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      // const storage = app.storage();
      const ref = storage.ref(
        `imagens/profile/IMAGE-${auth.currentUser.uid}.jpg`
      );
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore
        .collection("Usuario")
        .doc(auth.currentUser.uid);
      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      reference.update({ urlfoto: paraDonwload });
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      //const storage = storage.storage();
      const ref = storage.ref(`imagens/IMAGE-${auth.currentUser.uid}.jpg`);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore
        .collection("Usuario")
        .doc(auth.currentUser.uid);
      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      reference.update({ urlfoto: paraDonwload });
    }
  };

  return (
    <Layout>
       <TopNav
        middleContent={
          <Image
            source={require("../../assets/nome.png")}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        }
        leftContent={<Ionicons name="menu" size={30} color={isDarkmode ? themeColor.dark100 : "black"}/>}
      />
     
    <View style={styles.screen}>
    <Button
              color="#EF8F86"
              rightContent={
                <Ionicons
                    name="create"
                    size={20}
                    color={themeColor.white}
                />}
              text="Editar "
              onPress={editTask}
              style={{
                position: "absolute",
                marginTop: 10,
                backgroundColor: "#E8A998",
                right:30,
              }}
            />
      <Pressable onPress={() => escolhefoto()}>
        <View style={styles.imageContainer}>
          {pickedImagePath !== "" && (
            <Image source={{ uri: pickedImagePath }} style={styles.image} />
          )}
          {pickedImagePath === "" && (
            <Image
              source={require("../../assets/usuario.png")}
              style={styles.image}
            />
          )}
         {/*<TextInput
                  style={{
                    marginTop: 20,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  placeholder="Nome"
                  value={nome}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="text"
                  onChangeText={(text) => setNome(text)}
                >
                
                </TextInput>*/}
        <Text style={{ fontSize: 18,
    marginTop: 30,
    textAlign: "right",
    marginLeft:180,
    }}>{usuario.nome}</Text>
        <Text style={styles.text}>{usuario.email}</Text>
        <Text style={styles.text}>{usuario.numero}</Text>
        </View>
        </Pressable>
      {/*  <Button
              color="#EF8F86"
              text="Adicionar Serviço"
              onPress={() => {
                navigation.navigate("AddServico");
              }}
              style={{
                marginTop: 10,
                backgroundColor: "#E8A998",
              }}
            />*/}
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
                marginTop: 10,
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
    marginTop: 15,
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
    left:20,
  },
  text: {
    fontSize: 15,
    marginTop: 10,
    textAlign: "right",
    marginLeft:180,
  },
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB'
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
    },
    texts: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
});


