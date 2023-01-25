import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Image
          resizeMode="cover"
          style={{
            size: "100%",
          }}
          source={require("../../../assets/pagina.png")}
        />

        <View
          style={{
            flex: 3,
            paddingHorizontal: 20,
            paddingBottom: 20,
            //    backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
          }}
        >
          <Button
            color="#EF8F86"
            text={loading ? "Loading" : "Continue"}
            onPress={() => {
              login();
            }}
            style={{
              marginTop: 20,
            }}
            disabled={loading}
          />
          <Button
            color="#EF8F86"
            text={loading ? "Loading" : "Continue"}
            onPress={() => {
              login();
            }}
            style={{
              marginTop: 20,
            }}
            disabled={loading}
          />
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
}
