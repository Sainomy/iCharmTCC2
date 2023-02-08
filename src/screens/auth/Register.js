import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
} from "firebase/auth";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import DatePicker from "react-native-datepicker";
import { DatePickerInput } from "react-native-paper-dates";
import { firestore } from "../../../firebase";
import RNPickerSelect from "react-native-picker-select";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlfoto, setUrlfoto] = useState(null);

  async function register() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const reference = firestore
          .collection("Usuario")
          .doc(auth.currentUser.uid);
        reference.set({
          id: auth.currentUser.uid,
          nome: nome,
          email: email,
          descricao: descricao,
          // password: password,
          numero: numero,
          data: data,
          urlfoto: urlfoto,
        });
        console.log("Registered with:", user.email);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        setLoading(false);
        alert(errorMessage);
      });
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="cover"
              style={{
                height: 240,
                width: 330,
              }}
              source={require("../../../assets/register1.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="semibold"
              size="h3"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
            >
              C A D A S T R E - S E
            </Text>
            <Text>Nome</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Digite seu nome"
              value={nome}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="text"
              onChangeText={(text) => setNome(text)}
            />

            <Text style={{ marginTop: 15 }}>E-mail</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Digite seu e-mail"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Senha</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Digite sua senha"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Text style={{ marginVertical: 15 }}>Data de Nascimento</Text>

            <DatePickerInput
              backgroundColor="white"
              locale="pt"
              value={data}
              onChange={(text) => setData(text)}
              inputMode="start"
            />

            <Text style={{ marginTop: 15, marginVertical: 15 }}>Contato</Text>
            <TextInput
              placeholder="Digite seu número para contato"
              keyboardType="phone-pad"
              onChangeText={setNumero}
              value={numero}
              autoCorrect={false}
            />

            <Button
              color="#EF8F86"
              text={loading ? "Loading" : "Criar conta"}
              onPress={() => {
                register();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Já tem uma conta?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Entrar aqui
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
