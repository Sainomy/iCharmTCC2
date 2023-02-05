import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const Mapa = () => {
  const [position, setPosition] = useState({
    latitude: -31.30884,
    longitude: -54.113702,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");

  const enviarMapa = () => {
    Alert.alert("Teste");
  };
  return (
    <View>
      <MapView
        region={position}
        onPress={(e) =>
          setPosition({
            ...position,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: e.nativeEvent.coordinate.latitudeDelta,
            longitudeDelta: e.nativeEvent.coordinate.longitudeDelta,
          })
        }
      >
        <Marker coordinate={position} title={title} description={descricao} />
      </MapView>
      <Text>Latitude : {position.latitude}</Text>
      <Text>Longitude : {position.longitude}</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={(title) => setTitle(title)}
      />
      <TextInput
        placeholder="Descricao"
        value={descricao}
        onChangeText={(descricao) => setDescricao(descricao)}
      />
      <TouchableOpacity
        onPress={() => {
          enviarDados;
        }}
      >
        <Text>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Mapa;
