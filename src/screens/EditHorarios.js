import { useRoute } from "@react-navigation/core";
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
  CheckBox,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";
import { auth, firestore, storage } from "../../firebase";
import { getStorage, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

export default function SecondScreen({ navigation }) {
  const { isDarkmode } = useTheme();
  const [pro, setPro] = useState(auth.currentUser.uid);
  const [hora8, setHora8] = useState(false);
  const [hora8t, setHora8t] = useState("8:00");
  const [hora9, setHora9] = useState(true);
  const [hora9t, setHora9t] = useState("9:00");
  const [hora10t, setHora10t] = useState("10:00");
  const [hora10, setHora10] = useState(true);
  const [hora11t, setHora11t] = useState("11:00");
  const [hora11, setHora11] = useState(true);
  const [hora12t, setHora12t] = useState("12:00");
  const [hora12, setHora12] = useState(true);
  const [hora13, setHora13] = useState(true);
  const [hora13t, setHora13t] = useState("13:00");
  const [hora14, setHora14] = useState(true);
  const [hora14t, setHora14t] = useState("14:00");
  const [hora15, setHora15] = useState(true);
  const [hora15t, setHora15t] = useState("15:00");
  const [hora16, setHora16] = useState(true);
  const [hora16t, setHora16t] = useState("16:00");
  const [hora17, setHora17] = useState(true);
  const [hora17t, setHora17t] = useState("17:00");
  const [hora18, setHora18] = useState(true);
  const [hora18t, setHora18t] = useState("18:00");
  const [hora19, setHora19] = useState(true);
  const [hora19t, setHora19t] = useState("19:00");
  const [hora20, setHora20] = useState(false);
  const [hora20t, setHora20t] = useState("20:00");
  const [hora21, setHora21] = useState(false);
  const [hora21t, setHora21t] = useState("21:00");
  const [hora22, setHora22] = useState(false);
  const [hora22t, setHora22t] = useState("22:00");
  const [hora23, setHora23] = useState(false);
  const [hora23t, setHora23t] = useState("23:00");
  const [editado, setEditado] = useState(false);

  const referenceHorarios = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Horarios")
    .doc();

  const enviarDados = () => {
    referenceHorarios
      .set({
        hora8: hora8t,
        hora9: hora9t,
        hora10: hora10t,
        hora11: hora11t,
        hora12: hora12t,
        hora13: hora13t,
        hora14: hora14t,
        hora15: hora15t,
        hora16: hora16t,
        hora17: hora17t,
        hora18: hora18t,
        hora19: hora19t,
        hora20: hora20t,
        hora21: hora21t,
        hora22: hora22t,
        hora23: hora23t,
      })
      .then(() => {
        const cancelBtn: AlertButton = {
          text: "Voltar ao Perfil",
          onPress: () => {
            navigation.navigate("Profile", { editado: true });
          },
        };
        const deleteBtn: AlertButton = {
          text: "Visualizar horários",
          onPress: () => {
            navigation.navigate("Profile", { editado: true });
          },
        };

        Alert.alert(`Horários adicionados com sucesso!`, "Volte ao perfil", [
          deleteBtn,
          cancelBtn,
        ]);
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
                  Editando Horários
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 15,
                  }}
                >
                  <CheckBox
                    checkedColor={"pink"}
                    value={hora8}
                    onValueChange={(val) => {
                      setHora8(val);
                      if (val === true) {
                        setHora8t("8:00");
                      } else {
                        setHora8t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    8:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 30 }}
                    checkedColor={"pink"}
                    value={hora9}
                    onValueChange={(val) => {
                      setHora9(val);
                      if (val === true) {
                        setHora9t("9:00");
                      } else {
                        setHora9t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    9:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 30 }}
                    checkedColor={"pink"}
                    value={hora10}
                    onValueChange={(val) => {
                      setHora10(val);
                      if (val === true) {
                        setHora10t("10:00");
                      } else {
                        setHora10t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    10:00
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <CheckBox
                    checkedColor={"pink"}
                    value={hora11}
                    onValueChange={(val) => {
                      setHora11(val);
                      if (val === true) {
                        setHora11t("11:00");
                      } else {
                        setHora11t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    11:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora12}
                    onValueChange={(val) => {
                      setHora12(val);
                      if (val === true) {
                        setHora12t("12:00");
                      } else {
                        setHora12t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    12:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora13}
                    onValueChange={(val) => {
                      setHora13(val);
                      if (val === true) {
                        setHora13t("13:00");
                      } else {
                        setHora13t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    13:00
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <CheckBox
                    checkedColor={"pink"}
                    value={hora14}
                    onValueChange={(val) => {
                      setHora14(val);
                      if (val === true) {
                        setHora14t("14:00");
                      } else {
                        setHora14t(" ");
                      }
                    }}
                  />
                  <Text
                    style={{ marginLeft: 18 }}
                    size="md"
                    style={styles.hora}
                  >
                    14:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora15}
                    onValueChange={(val) => {
                      setHora15(val);
                      if (val === true) {
                        setHora15t("15:00");
                      } else {
                        setHora15t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    15:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora16}
                    onValueChange={(val) => {
                      setHora16(val);
                      if (val === true) {
                        setHora16t("16:00");
                      } else {
                        setHora16t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    16:00
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <CheckBox
                    checkedColor={"pink"}
                    value={hora17}
                    onValueChange={(val) => {
                      setHora17(val);
                      if (val === true) {
                        setHora17t("17:00");
                      } else {
                        setHora17t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    17:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora18}
                    onValueChange={(val) => {
                      setHora18(val);
                      if (val === true) {
                        setHora18t("18:00");
                      } else {
                        setHora18t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    18:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora19}
                    onValueChange={(val) => {
                      setHora19(val);
                      if (val === true) {
                        setHora19t("19:00");
                      } else {
                        setHora19t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    19:00
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <CheckBox
                    checkedColor={"pink"}
                    value={hora20}
                    onValueChange={(val) => {
                      setHora20(val);
                      if (val === true) {
                        setHora20t("20:00");
                      } else {
                        setHora20t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    20:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora21}
                    onValueChange={(val) => {
                      setHora21(val);
                      if (val === true) {
                        setHora21t("21:00");
                      } else {
                        setHora21t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    21:00
                  </Text>
                  <CheckBox
                    style={{ marginLeft: 18 }}
                    checkedColor={"pink"}
                    value={hora22}
                    onValueChange={(val) => {
                      setHora22(val);
                      if (val === true) {
                        setHora22t("22:00");
                      } else {
                        setHora22t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    22:00
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <CheckBox
                    checkedColor={"pink"}
                    value={hora23}
                    onValueChange={(val) => {
                      setHora23(val);
                      if (val === true) {
                        setHora23t("23:00");
                      } else {
                        setHora23t(" ");
                      }
                    }}
                  />
                  <Text size="md" style={styles.hora}>
                    23:00
                  </Text>
                </View>

                <Button
                  color="#EF8F86"
                  text={"Adicionar"}
                  onPress={() => {
                    enviarDados();
                    setEditado(true);
                  }}
                  style={{
                    marginTop: 20,
                  }}
                />
              </View>
            </SectionContent>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}
const styles = StyleSheet.create({
  hora: {
    marginLeft: 10,
    color: "gray",
    fontSize: 20,
  },
});
