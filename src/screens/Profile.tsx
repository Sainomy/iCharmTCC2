import { useRoute} from "@react-navigation/core";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity
} from "react-native";
// import firebaseConfig from "./firebase";
// import firebase from "firebase/compat/app";
// import "firebase/compat/storage";
// const app = firebase.initializeApp(firebaseConfig);
import { auth, firestore, storage } from "../../firebase";
//import { doc, getDoc } from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage"; //access the storage database
import * as ImagePicker from "expo-image-picker";
import { Usuario } from "../../model/Usuario";
import { Servico } from "../../model/Servico"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Layout, TopNav, Button, Text,  useTheme,
  themeColor, CheckBox} from "react-native-rapi-ui";
//import ListarServico from "./service/ListarServico";
import Mapa from "../screens/utils/Mapa"
import MapView, { Marker } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { Horarios } from "../../model/Horarios";

export default function Profile({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [make, setMake] = useState(false);
  const [cabelo, setCabelo] = useState(false);
  const [cilios, setCilios] = useState(false);
  const [unhas, setUnhas] = useState(false);
  const [pele, setPele] = useState(false);
  const modalizeRef = useRef(null);
  const [comentarios, setComentarios] = useState([]);
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  const [horarios, setHorarios] =  useState < Partial < Horarios >> ({});
  const [servicos, setServicos] = useState([]); // Initial empty array of users
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });
  const [pickedImagePath, setPickedImagePath] = useState("");
  const route = useRoute();

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        setUsuario(documentSnapshot.data());
        if (usuario.urlfoto == null) {
          setPickedImagePath("");
        } else {
          setPickedImagePath(usuario.urlfoto);
        };
       
      });
    return () => subscriber();
  }, [usuario]);

  useEffect(() => {
  
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Servico")
      .onSnapshot((querySnapshot) => {
        const servicos = [];
        querySnapshot.forEach((documentSnapshot) => {
          servicos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setServicos(servicos);
      
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
  
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Comentarios")
      .onSnapshot((querySnapshot) => {
        const comentarios = [];
        querySnapshot.forEach((documentSnapshot) => {
          comentarios.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });

        });
        setComentarios(comentarios);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

    useEffect(() => {
      const subscriber = firestore
        .collection("Usuario")
        .doc(auth.currentUser.uid)
        .collection("Horarios")
        .onSnapshot((querySnapshot) => {
          const horarios = [];
          querySnapshot.forEach((documentSnapshot) => {
            horarios.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setHorarios(horarios);
        
        });
      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, [horarios]);

  
 
  const ItemView = ({ item }) => {
    return (
      <View style={styles.alinhamentoLinha}>
        <TouchableOpacity
          activeOpacity={0.7}
        onPress={()=>//Abrir({servicoID:item.id}) 
                navigation.navigate("TelaServico", { servicoID: item.id, userpro:item.pro })
           }
        >
          <Image style={styles.image1} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>

        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>{item.nomecat}</Text>
          <Text style={styles.itemStyle}>R${item.valor} </Text>
        </View>
      </View>
    );
  };
  const ItemViewCom = ({ item }) => {
    return (
      <View style={styles.alinhamentoLinha}>
        <Image style={{  width: 50,
    height: 50,
    borderRadius: 150 / 2,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
    margin:10,
    left:10,}} source={{ uri: item.urlfoto }}  />
        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>{item.nome}</Text>
          <Text style={{ fontSize: 15,
    padding: 5,
    marginTop: 2,}}>{item.texto} </Text>
        </View>
      </View>
    );
  };
  function onOpen() {
    modalizeRef.current?.open();
  }
  const referenceCategorias = firestore
  .collection("Usuario")
  .doc(auth.currentUser.uid);

const save = () => {
  referenceCategorias
    .update({
    make: make,
    cabelo: cabelo,
    cilios: cilios,
    pele: pele,
    unhas: unhas,
    })
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkmode ? themeColor.dark100 : "white" }}>
    <TopNav
      style={{ borderColor: isDarkmode ? themeColor.dark100 : "white" }}
      middleContent={
        <Image
          source={require("../../assets/nome.png")}
          style={{ width: 110, height: 110 }}
          resizeMode="contain"
        />
      }
      leftContent={
        <Ionicons
          name="menu"
          size={30}
          color={isDarkmode ? themeColor.dark100 : "black"}
        />
      }
      leftAction={onOpen}
      rightContent={
        <Ionicons
          name="notifications-outline"
          size={25}
          color={"black"}
        />}
        rightAction={() => navigation.navigate("Favoritos")}
    />
    <Modalize ref={modalizeRef} snapPoint={250}>
      <View
        style={{
          flex: 1,
          height: 250,
          backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
        }}
      >
     <Text fontWeight="light" style={{ marginTop: 20, fontSize:20, textAlign:"center" }}>
             Categorias
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft:100, marginTop:5  }}>
              <CheckBox
              style={{marginTop:20,}}
                checkedColor={"#EF8F86"}
                value={make}
                onValueChange={(val) => {
                  setMake(val);
                }}
              />
              <Text size="md" style={{ marginLeft: 10, color: "gray", marginTop:20 }}>
                Maquiagem
              </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginLeft:100, marginTop:5   }}>
              <CheckBox
                checkedColor={"#EF8F86"}
                value={cabelo}
                onValueChange={(val) => {
                  setCabelo(val);
                }}
              />
              <Text size="md" style={{ marginLeft: 10, color: "gray" }}>
                Cabelo
              </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginLeft:100, marginTop:5  }}>
              <CheckBox
                checkedColor={"#EF8F86"}
                value={unhas}
                onValueChange={(val) => {
                  setUnhas(val);
                }}
              />
              <Text size="md" style={{ marginLeft: 10, color: "gray" }}>
                Unhas
              </Text>
              </View>
               <View style={{ flexDirection: "row", alignItems: "center", marginLeft:100, marginTop:5 }}>
              <CheckBox
                checkedColor={"#EF8F86"}
                value={pele}
                onValueChange={(val) => {
                  setPele(val);
                }}
              />
              <Text size="md" style={{ marginLeft: 10, color: "gray" }}>
                Limpeza de pele
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft:100, marginTop:5 }}>
              <CheckBox
                checkedColor={"#EF8F86"}
                value={cilios}
                onValueChange={(val) => {
                  setCilios(val);
                }}
              />
              <Text size="md" style={{ marginLeft: 10, color: "gray" }}>
                Cilíos
              </Text>
            </View>
<Pressable  style={{ position:"absolute",   right:0,
             padding:15 }}>
  <Ionicons
                  name="checkmark"
                  size={30}
                  color={"black"}
                  onPress={save} 
                  
              /></Pressable>

      </View>
    </Modalize>
      <ScrollView >
      <View style={{margin:10}}>
       
      <Button
              color="#EF8F86"
              onPress={() => {
                navigation.navigate("EditProfile");
              }}
              rightContent={
                <Ionicons
                    name="create"
                    size={20}
                    color={themeColor.white}
                    onPress={() => {
                      navigation.navigate("EditProfile");
                    }}
                />}
              text="Editar"
              style={{
                position: "absolute",
                backgroundColor: "#E8A998",
                right:0,
                marginTop:10,
              }}
            />
         
      </View>
    
    <View style={styles.screen}>
     
          {usuario.urlfoto !== "" && (
            <Image source={{ uri: usuario.urlfoto }} style={styles.image} />
          )}
          {usuario.urlfoto === "" && (
            <Image
              source={require("../../assets/usuario.png")}
              style={styles.image}
            />
          )}
         
        
        <Text style={{ fontSize: 18, marginTop: 50, textAlign: "right", marginLeft:100,}}>
          {usuario.nome}
          </Text>
          {usuario.pro === true && (
            <Text style={{color: "gray", textAlign: "right", marginLeft:100,}}>Profissional</Text>
            
          )}
        <Text style={styles.text}>{usuario.numero}</Text>
        <Text style={styles.text}>{usuario.email}</Text>
        <Text style={styles.text1}>{usuario.curtida}{  <Ionicons
            name="heart"
            size={26}
            color={"#EF8F86"}
            style={{  position:"absolute", marginTop:50}}
           
          /> }</Text>
        
        {usuario.pro === true && (
          <View style={{flexDirection:"row"}}>
       
             <Button
             color="#EF8F86"
             style={{ marginTop: 20, marginRight:2 }}
             text="        Horários         "
             onPress={() => {
               navigation.navigate("AddHorarios", {idhora:horarios.id});
             }}
             outline 
             outlineWidth={1}
            
           /> 
             <Button
             color="#EF8F86"
             style={{ marginTop: 20 }}
             text="      Categorias        "
             onPress={onOpen}
             outline
             outlineWidth={1}
           /> 
         
          </View>
        )}
        <Text style={{color: "gray", marginTop:20}}>Sobre:</Text>
        <Text style={styles.text2}>{usuario.descricao}</Text>

        <View style={{flexDirection:"row", marginTop:10}}>
          <Ionicons name="pin" size={25} color={"black"}/>
            <Text fontWeight="light" style={{marginLeft:5, fontSize:20}}>Endereços</Text>
            </View>
        <ScrollView
        style={{ flex: 1 }}
        directionalLockEnabled={false}
        horizontal={true}>
        <Mapa />
        <Ionicons
        name="create"
        size={30}
        color={"black"}
        style={{ alignItems: "center", padding: 30 }}
        onPress={() => {
          navigation.navigate("Endereco");
        }}
      />
      
        </ScrollView>
          {/*  <Button
              color="#EF8F86"
              style={{ marginTop: 20 }}
              text="Serviços"
              onPress={() => {
                navigation.navigate("ListarServico", { userID: auth.currentUser.uid });
              }}
            />*/}
{/*<MeusServicos />*/}
{usuario.pro === true && (
  <View>
<View style={{flexDirection:"row", marginTop:10}}>
          <Ionicons name="images" size={25} color={"#EF8F86"}/>
            <Text fontWeight="light" style={{marginLeft:5, fontSize:20}}>Serviços</Text>
            </View>
<FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          //  ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
           
          
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("AddServico");
            }} style={{alignItems:"center"}}>
            <Ionicons name="add-circle" size={60} color={"#EF8F86"} style={{ width: 70,height: 70,}}/>
          </TouchableOpacity>
          </View>
          )}
          <View style={{flexDirection:"row"}}>
          <Ionicons name="chatbox-ellipses" size={25} color={"#EF8F86"}/>
            <Text>Comentários</Text>
            </View>
            
            <FlatList
          data={comentarios}
          keyExtractor={(item) => item.id}
          //  ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemViewCom}
        />
        </View>
        </ScrollView>
    </SafeAreaView>
    
  );
      }   
const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
  },
  container: {},
  itemStylee: {
    fontSize: 20,
    padding: 5,
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 18,
    padding: 5,
    color: "green",
  },
  alinhamentoLinha: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 12,
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
  screen: {
    flex: 1,
    //justifyContent: "center",
   // alignItems: "center",
   //marginTop:50,
   margin: 5,
  },
  image1: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 15,
  },
  buttonContainer: {
    width: 400,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "blue",
  },
  imageContainer: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
    position:"absolute", 
    left:10,
  },
  text: {
    fontSize: 15,
    marginTop: 10,
    textAlign: "right",
    
    position:"relative"
  },
  text1: {
    fontSize: 22,
    textAlign: "left",
    position:"relative"
  },
  text2: {
    fontSize: 15,
    marginTop: 10,
    textAlign: "left",
  },
    texts: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
});


