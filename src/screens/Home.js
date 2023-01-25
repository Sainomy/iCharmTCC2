import React from "react";
import { useState, useRef } from "react";
import { View, Linking, Image, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";

export default function ({ navigation }) {
  const modalizeRef = useRef(null);
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();

  function onOpen() {
    modalizeRef.current?.open();
  }
  return (
    <Layout>
      <TopNav
        style={{ borderColor: isDarkmode ? themeColor.dark100 : "#E6E6E6" }}
        middleContent={
          <Image
            source={require("../../assets/nome.png")}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        }
        leftContent={<Ionicons name="menu" size={30} />}
        leftAction={onOpen}
      />
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Welcome");
            }}
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
            <Text>Tela de bem-vindo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              signOut(auth);
            }}
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
            <Text style={{ color: "red" }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <Section>
          <SectionContent>
            <Button
              color="#EF8F86"
              style={{ marginTop: 10 }}
              text="Listar Serviços"
              onPress={() => {
                navigation.navigate("ListarServico");
              }}
            />
            <Button
              color="#EF8F86"
              text="Adicionar Serviço"
              onPress={() => {
                navigation.navigate("AddServico");
              }}
              style={{
                marginTop: 10,
                backgroundColor: "#E8A998",
              }}
            />

            <Button
              text={isDarkmode ? "Modo Claro" : "Modo Escuro"}
              status={isDarkmode ? "success" : "warning"}
              onPress={() => {
                if (isDarkmode) {
                  setTheme("light");
                } else {
                  setTheme("dark");
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Sair"
              onPress={() => {
                signOut(auth);
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
