//
// Alunos, o Exemplo base foi retirado do site
// https://devsamurai.com.br/react-native-mapa-geolocalizacao/
//
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
export default function Endereco({ navigation }) {
  const [position, setPosition] = useState({
    latitude: -31.30884,
    longitude: -54.113702,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={position}
        onPress={(e) =>
          setPosition({
            ...position,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: e.nativeEvent.coordinate.latitudeDelta,
            longitudeDelta: e.nativeEvent.coordinate.longitudeDelta,
          }) +
          alert(
            "Latitude:" +
              e.nativeEvent.coordinate.latitude +
              " \nLongitude: " +
              e.nativeEvent.coordinate.longitude
          )
        }
      >
        <Marker
          coordinate={position}
          title={"Marcador"}
          description={"Testando o marcador no mapa"}
        />
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
