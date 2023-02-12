import { useNavigation, useRoute} from "@react-navigation/core";
import React, {  useState, useEffect, useRef } from "react";
import { Dimensions,View, StyleSheet, Image, Alert, Pressable, TouchableOpacity, TextInput,
  FlatList,} from "react-native";
// import firebaseConfig from "./firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
// const app = firebase.initializeApp(firebaseConfig);
import { auth, firestore, storage } from "../../../firebase";
//import { doc, getDoc } from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage"; //access the storage database
import * as ImagePicker from "expo-image-picker";
import { Usuario } from "../../../model/Usuario";
import { Servico } from "../../../model/Servico";
import { Foto } from "../../../model/Foto"
import Ionicons from "@expo/vector-icons/Ionicons";
import { Layout, TopNav, Button, Text,useTheme ,themeColor} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";
import Carousel from "../../components/utils/Carousel";
import { ScrollView } from "react-native-gesture-handler";
//import AcModalize from "../Agendamento";

export default function TelaServico({navigation} ) {
  const { isDarkmode } = useTheme();
  const modalizeRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalListaVisible, setModalListaVisible] = useState(false);

  const [servico, setServico] = useState  < Servico >({});
  const [usuario, setUsuario] = useState  < Usuario > ({});
  const [fotos, setFotos] = useState < Foto > ({});
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });

 { /*function onOpen() {
    modalizeRef.current?.open();
  }*/}
  const route = useRoute();
  
  const {servicoID}=  route.params
  const referenceServico = firestore
  .collection("Usuario")
  .doc(auth.currentUser.uid)
  .collection("Servico")
  .doc(servicoID);
  const [pickedImagePath, setPickedImagePath] = useState("");
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc(servicoID)
      .onSnapshot((documentSnapshot) => {
        setServico(documentSnapshot.data());
        if (servico.urlfoto == null) {
          setPickedImagePath("");
        } else {
          setPickedImagePath(servico.urlfoto);
        }
      });
    return () => subscriber();
  }, [servico]);

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc(servicoID)
      .collection("Foto")
      .onSnapshot((querySnapshot) => {
        const fotos = [];
        querySnapshot.forEach((documentSnapshot) => {
          fotos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setFotos(fotos);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [fotos]);

  const ItemView = ({ item }) => {
    return (
        <TouchableOpacity
          activeOpacity={0.7}
        >
          <Image style={styles.image} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>
    );
  };

  function onOpen() {
    modalizeRef.current?.open();
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
        `imagens/servico/IMAGE-${referenceServico.id}.jpg`
      );
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc();
      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      referenceServico.update({ urlfoto: paraDonwload });
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
      const ref = storage.ref(`imagens/servico/IMAGE-${referenceServico.id}.jpg`);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);
      const reference = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc();
      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      referenceServico.update({ urlfoto: paraDonwload });
    }
    const ItemView = ({ item }) => {
      return (
        <View >
            <Image style={styles.image} source={{ uri: item.urlfoto }} />
  
        </View>
      );
    }
  };


  return (
    <Layout>
      <TopNav
        middleContent={
          <Image
            source={require("../../../assets/nome.png")}
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
   {/* <Carousel />*/}
   { /* <AcModalize />*/}
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
        <TextInput
          style={{
            marginTop: 10,
            borderWidth: 2,
            padding: 10,
            borderRadius: 6,
          }}
          containerStyle={{ marginTop: 15 }}
          placeholder="Data hora"
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          keyboardType="text"
        />
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: "white",
            borderRadius: 6,
            padding: 15,
            borderWidth: 1,
            borderColor: "rgba(0,0,0, 0.2)",
            marginTop: 10,
            marginHorizontal: 15,
            marginVertical: 6,
          }}
        >
          <Text>Agendar</Text>
        </TouchableOpacity>
      </View>
    </Modalize>
      
      <ScrollView style={styles.screen}>
      <ScrollView
      style={{flex: 1}}
      directionalLockEnabled={false}
      horizontal={true}>
      <FlatList
        numColumns={50}
        data={fotos}
        renderItem={ ItemView}
      />
    </ScrollView>

        <Pressable onPress={() => escolhefoto()}>
          <View style={styles.imageContainer}>
            {pickedImagePath !== "" && (
              <Image source={{ uri: pickedImagePath }} style={styles.image} />
            )}
            {pickedImagePath === "" && (
              <Image
                source={require("../../../assets/usuario.png")}
                style={styles.image}
              />
            )}
            <Text style={{fontSize: 30, fontStyle:"italic", margin:5}}>{servico.nomecat}</Text>
            <Text>{servico.descricao}</Text>
            <Text style={{color:"green"}}>R${servico.valor}</Text>
          </View>
        </Pressable>
        <View style={{marginRight:10, marginLeft:10}}>
        <Button
          color="#EF8F86"
          text="Adicionar mais Fotos"
          onPress={() => {
            navigation.navigate("AddFotos",{servico:servico});
          }}
        
        />
         
        <Button
          color="#EF8F86"
          text="Marcar Horário"
          onPress={onOpen}
          style={{
            marginTop: 10,
            backgroundColor: "#E8A998",
          }}
        />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
   
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
    width: 310,
    height: 250,
   borderRadius: 20,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
});
