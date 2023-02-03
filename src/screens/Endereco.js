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
import { Endereco } from "../../model/Endereco";
import { TextInputMask } from "react-native-masked-text";
import { auth, firestore, storage } from "../../firebase";
import { getStorage, uploadBytes } from "firebase/storage";
import Axios from "axios";

export default function SecondScreen({ navigation }) {
  const { isDarkmode } = useTheme();
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [loading, setLoading] = useState(false);
  const [uf, setUf] = useState("");
  const [endereco, setEndereco] = useState({
    cep: "",
    item: [],
  });

  buscarCep = () => {
    Axios.get(`https://viacep.com.br/ws/${endereco.cep}/json/`)
      .then((response) => {
        setEndereco({ ...endereco, item: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        return console.log(error);
      });
  };
  //const [progressPorcent, setPorgessPorcent] = useState(0);
  const referenceEndereco = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Endereco")
    .doc();

  const enviarDados = () => {
    referenceEndereco
      .set({
        id: referenceEndereco.id,
        cep: endereco.item.cep,
        rua: endereco.item.logradouro,
        bairro: endereco.item.bairro,
        cidade: endereco.item.localidade,
        uf: endereco.item.uf,
        numero: numero,
        complemento: complemento,
        lat: lat,
        long: long,
      })
      .then(() => {
        const cancelBtn: AlertButton = {
          text: "Ver perfil",
          onPress: () => {
            navigation.navigate("Profile");
          },
        };
        const deleteBtn: AlertButton = {
          text: "Adicionar mais um endereço",
          onPress: () => {
            navigation.navigate("Endereco");
          },
        };

        Alert.alert(
          `Deseja adicionar mais um endereço?`,
          "ou clique em voltar ao perfil",
          [deleteBtn, cancelBtn]
        );
      });
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
                  Adicionando Endereço
                </Text>
                <Text style={{ marginTop: 15 }}>CEP</Text>
                <TextInput
                  placeholder="Digite o CEP"
                  value={endereco.cep}
                  onBlur={() => {
                    buscarCep();
                  }}
                  onChangeText={(cep) => setEndereco({ ...endereco, cep: cep })}
                  // style={}
                />

                <Text style={{ marginTop: 15 }}>Rua</Text>
                <TextInput
                  style={{
                    marginTop: 10,
                    borderColor: "#f8f8ff",
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  multiline
                  numberOfLines={10}
                  placeholder="Rua"
                  value={rua}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={(text) => setRua(text)}
                >
                  {endereco.item.logradouro}
                </TextInput>

                <Text style={{ marginTop: 15 }}>Bairro</Text>
                <TextInput
                  style={{
                    marginTop: 10,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  placeholder="Bairro"
                  value={bairro}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="text"
                  onChangeText={(text) => setBairro(text)}
                >
                  {endereco.item.bairro}
                </TextInput>
                <Text style={{ marginTop: 15 }}>Cidade</Text>
                <TextInput
                  style={{
                    marginTop: 10,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  placeholder="cidade"
                  value={cidade}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="text"
                  onChangeText={(text) => setCidade(text)}
                >
                  {endereco.item.localidade}
                </TextInput>
                <Text style={{ marginTop: 15 }}>Estado</Text>
                <TextInput
                  style={{
                    marginTop: 10,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  placeholder="estado"
                  value={uf}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="text"
                  onChangeText={(text) => setUf(text)}
                >
                  {endereco.item.uf}
                </TextInput>
                <Text style={{ marginTop: 15 }}>Complemento</Text>
                <TextInput
                  style={{
                    marginTop: 10,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  placeholder="Complemento"
                  value={complemento}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="text"
                  onChangeText={(text) => setComplemento(text)}
                />

                <Text style={{ marginTop: 15 }}>Numero</Text>
                <TextInput
                  style={{
                    marginTop: 10,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 6,
                  }}
                  containerStyle={{ marginTop: 15 }}
                  placeholder="Numero"
                  value={numero}
                  autoCapitalize="none"
                  autoCompleteType="off"
                  autoCorrect={false}
                  keyboardType="text"
                  onChangeText={(text) => setNumero(text)}
                />

                <Button
                  color="#EF8F86"
                  text={loading ? "Adicionar" : "Adicionar"}
                  onPress={enviarDados}
                  style={{
                    marginTop: 20,
                  }}
                  disabled={false}
                />
              </View>
            </SectionContent>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}
