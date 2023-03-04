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
  ScrollView,
  Switch,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, TopNav,  useTheme,
  themeColor, Button, Layout, CheckBox,} from "react-native-rapi-ui";
  import { DatePickerInput } from 'react-native-paper-dates';
  import { SafeAreaProvider } from "react-native-safe-area-context";
// import firebaseConfig from "./firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
// const app = firebase.initializeApp(firebaseConfig);
import { storage, auth, firestore } from "../../firebase";
import { getStorage, uploadBytes } from "firebase/storage"; //access the storage databaSse
import * as ImagePicker from "expo-image-picker";
import { Usuario } from "../../model/Usuario";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth } from "firebase/auth";
import MaskInput from "react-native-mask-input";

export default function EditProfile({ navigation, route}) {
  const auth = getAuth();
  const toggleSwitch = () => setPro((previousState) => !previousState);
  const { isDarkmode, setTheme } = useTheme();
  //antes era só function profile
  const [modalListaVisible, setModalListaVisible] = useState(false);
 {/* const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    categoria: "",
  });*/}
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletado, setDeletado]= useState(false);

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
        descricao:  usuario.descricao,
          // password: password,
        numero:  usuario.numero,
        data:  usuario.data,
        pro: usuario.pro,
        urlfoto:  usuario.urlfoto,
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
  const deleteServico = async () => {
    const user = auth.currentUser;
    setDeletado(true);

    user.delete();
    firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .delete().then(function(){
        navigation.goBack();
    });

  {/* const ft = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Foto")
      .doc();   
    ft.delete();

    const hr = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Horarios")
      .doc();   
    hr.delete();

    const cm = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Comentarios")
      .doc();   
    cm.delete();

    const en = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Endereco")
      .doc();   
    en.delete();

    const fv = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Favoritos")
      .doc();   
    fv.delete();

    const sv = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc();   
  sv.delete();*/}

  };
 
  if(deletado===false){
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
    <Layout>
    <ScrollView >
  
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
     
<View style={{marginRight:20, marginLeft:20}}>

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
          <Ionicons
            name="create"
            size={30}
            position="absolute"
            color={isDarkmode ? themeColor.white100 : themeColor.black}
          />
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
                    multiline
                    numberOfLines={10}
                    placeholder="(opcional)"
                    value={usuario.descricao}
                    autoCorrect={false}
                    onChangeText={(text) => setUsuario({ ...usuario, descricao: text })}
                  />
      
            <Text style={{ marginTop: 15, marginVertical: 15 }}>Contato</Text>
            <MaskInput
              style={{
                height: 40,
                margin: 2,
                borderWidth: 1,
                padding: 10,
                borderRadius: 7,
                borderColor: themeColor.white200,
              }}
              keyboardType="phone-pad"
              value={usuario.numero}
              onChangeText={(masked) => setUsuario({ ...usuario, numero: masked })}
              mask={[
                "(",
                /\d/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
            />
             <Text style={{ marginTop: 15, marginVertical: 15 }}>
              Profissional?
            </Text>

            <Switch
              trackColor={{ false: "#767577", true: "#EF8F86" }}
              thumbColor={usuario.pro ? "white" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(boolean) => setUsuario({...usuario, pro:boolean})}
              value={usuario.pro}
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
             disabled={loading===(false)}
            />
             <Button
                    color={themeColor.danger}
                    text={"Excluir"}
                    onPress={deleteServico}
                    style={{
                      marginTop: 10,
                    }}
                  />
</View>
    </ScrollView>
    </Layout>
  </KeyboardAvoidingView>
  );
}else{
  navigation.navigate("Login");
};
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop:20,
    //padding: 30,
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

