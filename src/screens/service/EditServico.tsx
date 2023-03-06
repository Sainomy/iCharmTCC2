import { useRoute} from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  AlertButton,
  Pressable
} from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button,
  Section,
  SectionContent,
  TextInput,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { Servico } from "../../../model/Servico";
import { TextInputMask } from "react-native-masked-text";
import { auth, firestore, storage } from "../../../firebase";
import { getStorage, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function EditServico({ navigation }) {
  const { isDarkmode } = useTheme();
  const [servico, setServico] = useState < Partial < Servico >> ({});
  const [valor, setValor] = useState(0);
  const [inputMoeda, setInputMoeda] = useState("0");
  const [loading, setLoading] = useState(true);
  const [urlfoto, setUrlfoto] = useState("");
  const [pickedImagePath, setPickedImagePath] = useState("");
  const route = useRoute();
  const [deletado, setDeletado]= useState(false);
  
   
    let {servicoID}=  route.params
   
      const referenceServico = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc(servicoID);
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
    }};
  
     const salvar = () => {
      const reference = firestore.collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc(servicoID);
      reference
        .update({
          id: reference.id,
          nomecat: servico.nomecat,
          descricao:  servico.descricao,
          tempo: servico.tempo,
          valor:  servico.valor,
          urlfoto:  servico.urlfoto,
        })
        .then(() => {
          alert("Salvo com sucesso");
        })
        .catch((error) => alert(error.message));
    };
 

  const deleteServico = async () => {
    setDeletado(true);
   const ft = firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc(servicoID)
      .collection("Foto")
      .doc();
    ft.delete();

    firestore
    .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .doc(servicoID)
      .delete();
  };
 
  if(deletado===false){
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
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

    
       
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 10,
            //  borderColor: "black",
            //  borderWidth: 1,
              borderRadius: 20,
              shadowColor: "#171717",
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
          >
            <Section>
              <SectionContent
                style={{
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                 //   paddingHorizontal: 5,
                    paddingBottom: 20,
                    backgroundColor: isDarkmode
                      ? themeColor.dark
                      : themeColor.white,
                  }}
                >
                  <Text
                    fontWeight="semibold"
                    size="h3"
                    style={{
                      alignSelf: "center",
                    }}
                  >
                    Editar Serviço
                  </Text>
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
              value={servico.nomecat}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="text"
              onChangeText={(text) => setServico({ ...servico, nomecat: text })}
             />
             <Text style={{ marginTop: 15 }}>Descrição</Text>
                  <TextInput
                    containerStyle={{ marginTop: 15 }}
                    multiline
                    numberOfLines={10}
                    value={servico.descricao}
                    autoCorrect={false}
                    onChangeText={(text) => setServico({ ...servico, descricao: text })}
                  />

                   <Text style={{ marginTop: 15 }}>Duração do Procedimento</Text>
                  <TextInput
                    style={{
                      marginTop: 10,
                      borderWidth: 2,
                      padding: 10,
                      borderRadius: 6,
                    }}
                    containerStyle={{ marginTop: 15 }}
                    placeholder="30min/1h"
                    value={servico.tempo}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="text"
                    onChangeText={(text) => setServico({ ...servico, tempo: text })}
                  />

                  <Text style={{ marginTop: 15 }}>Valor</Text>
                  <TextInputMask
                    style={{
                      marginTop: 10,
                      borderColor:  "#f8f8ff",
                      borderWidth: 2,
                      padding: 10,
                      borderRadius: 6,
                    }}
                    type={"money"}
                    placeholder="Valor do serviço"
                    keyboardType="phone-pad"
                    value={servico.valor}
                    maxLength={18}
                    onChangeText={(value) => {
                      setInputMoeda(value);
                      value = value.replace("R$", "");
                      value = value.replace(".", "");
                      value = value.replace(",", ".");
                      setServico({ ...servico, valor: Number(value) });
                    }}
                  />
                   
                 
                  <Button
                    color="#EF8F86"
                    text={loading ? "Salvar" : "Carregando"}
                    onPress={() => {
                      salvar();
                      navigation.goBack();
                    }}
                    
                    style={{
                      marginTop: 20,
                    }}
                  //  disabled={loading===(false)}
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
              </SectionContent>
            </Section>
          </ScrollView>
        
    
    </Layout>
    </KeyboardAvoidingView>
     ); 
  }else{
    navigation.navigate("Profile");
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
    borderRadius: 40,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
});