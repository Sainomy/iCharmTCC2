import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
} from "react-native";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
const image = require("../../../assets/welcome3.png");

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
      >
        <View
          style={{
            flex: 3,
            paddingHorizontal: 20,
            paddingBottom: 20,
            justifyContent: "flex-end",

            //    backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
          }}
        >
          <Button
            color="#000000"
            text={loading ? "Loading" : "E N T R A R"}
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={{
              marginStart: 20,
              marginEnd: 20,
              marginTop: 20,
              position: "end",
              borderRadius: 40,
            }}
            disabled={loading}
          />
          <Button
            textStyle={{ color: "black" }}
            color="#F8D6D4"
            text={loading ? "Loading" : "C A D A S T R E - S E"}
            onPress={() => {
              navigation.navigate("Register");
            }}
            style={{
              marginTop: 20,
              marginVertical: 40,
              borderRadius: 40,
              marginStart: 20,
              marginEnd: 20,
            }}
            disabled={loading}
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
