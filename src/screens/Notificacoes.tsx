import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { Text, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { Usuario } from "../../model/Usuario";
import { ScrollView } from "react-native-gesture-handler";
import { Notificacao } from "../../model/Notificacao";
import { listAll } from "firebase/storage";
import { Agendamento } from "../../model/Agendamento";

export default function Notificacacoes({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [notificacoes, setNotificacoes] = useState < Partial < Notificacao >> ({});
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  const [pickedImagePath, setPickedImagePath] = useState("");
 
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Notificacao")
      .orderBy("data", "asc")
      .onSnapshot((querySnapshot) => {
        const notificacoes = [];
        querySnapshot.forEach((documentSnapshot) => {
          notificacoes.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setNotificacoes(notificacoes);
      
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [notificacoes]);

  const ItemView = ({ item }) => {
    return (
      <Pressable onLongPress={() => {const cancelBtn: AlertButton = {
        text: "Voltar",
        
      };
      const deleteBtn: AlertButton = {
        text: "Apagar",
        onPress: () => { { 
         
            const apagar = firestore
            .collection("Usuario")
            .doc(auth.currentUser.uid)
            .collection("Notificacao")
            .doc(item.id);
            apagar.delete()
         
        }
        },
      };
  
      Alert.alert(
        `Deseja excluir seu comentários`,
        " ou voltar?",
        [deleteBtn, cancelBtn]
      );}}>
      <View style={styles.alinhamentoLinha}>
        {item.confir === true && (
           <Ionicons
           name="checkmark"
           size={30}
           color={"green"}
           style={{position:"relative",padding:20}}
          
         />
       ) }
        {item.confir === false && (
           <Ionicons
           name="close"
           size={30}
           color={"red"}
           style={{position:"relative",padding:20}}
          
         />
        )}
      <View style={styles.alinhamentoColuna}>
        
        <View style={{flexDirection:"row"}}>
        <Text  style={styles.itemStylee}>{item.text} </Text>
       
       
        </View>
        <Text style={styles.itemStylee1}>{item.servico}, {item.data}, {item.hora} </Text>
        <Text style={styles.itemStylee1}>{item.nome}</Text>
       
      </View>
    </View>
    </Pressable>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:"white"}}>
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
    leftAction={() => navigation.goBack()}></TopNav>

    <FlatList 
    data={notificacoes}
    keyExtractor={(item) => item.id}
    //  ItemSeparatorComponent={ItemSeparatorView}
    renderItem={ItemView}
  />
   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
  },
  itemStylee1: {
    fontSize: 12,
    padding: 5,
    marginTop: 2,
  },
  itemStylee: {
    fontSize: 20,
    padding: 5,
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 18,
    padding: 0,
    color: "green",
  },
  alinhamentoLinha: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: "#d3d3d3",
    borderWidth:0.5
  },
  alinhamentoColuna: {
   flexDirection: "column",
   justifyContent: "flex-start",
  },
});
