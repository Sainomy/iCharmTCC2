import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  AlertButton,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ScrollView
} from "react-native";
import { TextInput, TopNav,  useTheme,
  themeColor, Button, Layout} from "react-native-rapi-ui";
// import firebaseConfig from "./firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
// const app = firebase.initializeApp(firebaseConfig);
import { storage, auth, firestore } from "../../firebase";
import { getStorage, uploadBytes } from "firebase/storage"; //access the storage databaSse
import * as ImagePicker from "expo-image-picker";
import { Usuario } from "../../model/Usuario";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Profile({ navigation, route}) {
  const { isDarkmode, setTheme } = useTheme();
  //antes era só function profile
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    categoria: "",
  });
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [loading, setLoading] = useState(false);

  const escolhefoto = () => {
    setLoading(false);
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
        }
      });
    return () => subscriber();
  }, [usuario.urlfoto]);

 

  const salvar = () => {
    const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
    reference
      .update({
        id: reference.id,
        nome: usuario.nome,
       
      })
      .then(() => {
        alert("Salvo com sucesso");
      })
      .catch((error) => alert(error.message));
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
      //  const ref = storage.ref(`imagens/IMAGE-${Date.now()}.jpg`);

      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);

      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();

      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore
        .collection("Usuario")
        .doc(auth.currentUser.uid);
      reference.update({ urlfoto: paraDonwload });
    }setLoading(true);
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
      const ref = storage.ref(
        `imagens/profile/IMAGE-${auth.currentUser.uid}.jpg`
      );
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);

      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();

      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore
        .collection("Usuario")
        .doc(auth.currentUser.uid);
      reference.update({ urlfoto: paraDonwload });
    }setLoading(true);
  };
 

  return (
    <Layout>
    <ScrollView style={{margin:20}}>
  
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
        </View>
      </Pressable>
      <Text>Nome</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Digite seu nome"
              value={usuario.nome}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="text"
              onChangeText={(text) => setUsuario({ ...usuario, nome: text })}
            />
       <Text style={{ marginTop: 15 }}>Descrição</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="(opcional)"
              value={usuario.descricao}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="text"
              onChangeText={(text) => setUsuario({ ...usuario, descricao: text })}
            />
       <Text style={{ marginTop: 15 }}>E-mail</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Digite seu e-mail"
              value={usuario.email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setUsuario({ ...usuario, email: text })}
            />

            <Text style={{ marginVertical: 15 }}>Data de Nascimento</Text>
           
            <Text style={{ marginTop: 15, marginVertical: 15 }}>Contato</Text>
            <TextInput
              placeholder="Digite seu número para contato"
              keyboardType="phone-pad"
              onChangeText={(text) => setUsuario({ ...usuario, numero: text })}
              value={usuario.numero}
              autoCorrect={false}
            />

     
              <Button
              color="#EF8F86"
              text={"Salvar"}
              onPress={() => {
                salvar();
                navigation.navigate("Profile");
              }}
              style={{
                marginTop: 20,
              }}
            //  disabled={loading===(false)}
            />


    </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
});

