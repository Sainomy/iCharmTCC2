import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme, themeColor, Button } from "react-native-rapi-ui";

export default function AcModalize() {
  const { isDarkmode } = useTheme();
  const modalizeRef = useRef(null);
  function onOpen() {
    modalizeRef.current?.open();
  }
  return (
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
  );
}

const styles = StyleSheet.create({});
