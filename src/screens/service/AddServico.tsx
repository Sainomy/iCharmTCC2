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

export default function SecondScreen({ navigation }) {
  const { isDarkmode } = useTheme();
  const [nomecat, setNomeCat] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [stars, setStars] = useState(0);
  const [inputMoeda, setInputMoeda] = useState("0");
  const [loading, setLoading] = useState(false);
  const [urlfoto, setUrlfoto] = useState("");
  //const [progressPorcent, setPorgessPorcent] = useState(0);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const referenceServico = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Servico")
    .doc();
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

      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      referenceServico.update({ urlfoto: paraDonwload });
      setUrlfoto(paraDonwload);
    }
    setLoading(true);
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
        `imagens/servico/IMAGE-${referenceServico.id}.jpg`
      );
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);
      console.log(result.uri);
      console.log("firebase url :", fbResult.metadata.fullPath);

      const paraDonwload = await storage
        .ref(fbResult.metadata.fullPath)
        .getDownloadURL();
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      referenceServico.update({ urlfoto: paraDonwload });
     
      setUrlfoto(paraDonwload);
     
    } setLoading(true);
  };

  const enviarDados = () => {
   
    referenceServico
      .set({
        id: referenceServico.id,
        nomecat: nomecat,
        descricao: descricao,
        valor: valor,
        urlfoto: urlfoto,
      })
      .then(() => {
        const cancelBtn: AlertButton = { text: 'Adicionar mais fotos' ,   onPress: () => {
          navigation.navigate('AddFotos')
          
        }}
        const deleteBtn: AlertButton = {
            text: 'Ver Serviço',
            onPress: () => {
              navigation.navigate('TelaServico', { servicoID: referenceServico.id })
              
            }
        }

        Alert.alert(`Deseja adicionar mais foto?`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
      });
     
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

      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
       
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
                    Criando Serviço
                  </Text>
                  <Text style={{ marginTop: 15 }}>Nome</Text>
                  <TextInput
                    style={{
                      marginTop: 10,
                      borderWidth: 2,
                      padding: 10,
                      borderRadius: 6,
                    }}
                    containerStyle={{ marginTop: 15 }}
                    placeholder="Nome do serviço"
                    value={nomecat}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    keyboardType="text"
                    onChangeText={(text) => setNomeCat(text)}
                  />

                  <Text style={{ marginTop: 15 }}>Descrição</Text>
                  <TextInput
                    style={{
                      marginTop: 10,
                      borderColor:  "#f8f8ff",
                      borderWidth: 2,
                      padding: 10,
                      borderRadius: 6,
                    }}
                    containerStyle={{ marginTop: 15 }}
                    multiline
                    numberOfLines={10}
                    placeholder="Informações sobre o serviço"
                    value={descricao}
                    autoCapitalize="none"
                    autoCompleteType="off"
                    autoCorrect={false}
                    onChangeText={(text) => setDescricao(text)}
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
                    value={inputMoeda}
                    maxLength={18}
                    onChangeText={(value) => {
                      setInputMoeda(value);
                      value = value.replace("R$", "");
                      value = value.replace(".", "");
                      value = value.replace(",", ".");
                      setValor(Number(value));
                    }}
                  />
                
                  <Ionicons
                    style={{ margin: 15 }}
                    name="add"
                    size={60}
                    color={isDarkmode ? themeColor.white100 : themeColor.black}
                    onPress={escolhefoto}
                  />

                  <Image
                    source={{ uri: pickedImagePath }}
                    style={{ width: 100, height: 100 }}
                    
                  />
                  <Button
                 
                    color="#EF8F86"
                    text={loading ? "Adicionar" : "Carregando"}
                    onPress={enviarDados}
                    style={{
                      marginTop: 20,
                    }}
                    disabled={loading===(false)}

                  />
                 
                </View>
              </SectionContent>
            </Section>
          </ScrollView>
        
      </KeyboardAvoidingView>
    </Layout>
  );
}
