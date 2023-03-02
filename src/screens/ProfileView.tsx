import React, { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute} from "@react-navigation/core";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
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
  themeColor, TextInput,} from "react-native-rapi-ui";
import ListarServico from "./service/ListarServico";
import Mapa from "../screens/utils/Mapa"
import MapView, { Marker } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";

export default function ProfileView({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const [like, setLike] = useState(false);
  const [texto, setTexto] = useState("");
  const [comentarios, setComentarios] = useState([]);
 
  const modalizeRef = useRef(null);
  const [usuariocli, setUsuariocli] = useState < Partial < Usuario >> ({});
  const [usuario, setUsuario] = useState < Partial < Usuario >> ({});
  const [servicos, setServicos] = useState([]); // Initial empty array of users
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });
  const route = useRoute();
  const {userID}=  route.params
  const [pickedImagePath, setPickedImagePath] = useState("");
  function onOpen() {
    modalizeRef.current?.open();
  }
 //profissional
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(userID)
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
  const [curtida, setCurtida] = useState(usuario.curtida);

  //cliente
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        setUsuariocli(documentSnapshot.data());
        if (usuario.urlfoto == null) {
          setPickedImagePath("");
        } else {
          setPickedImagePath(usuario.urlfoto);
        };
       
      });
    return () => subscriber();
  }, [usuariocli]);


//servico profissional
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(userID)
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

  const salvar = (diminui) => {
    const reference = firestore.collection("Usuario").doc(userID);
    reference
      .update({
        id: userID,
        nome: usuario.nome,
        email: usuario.email,
        descricao:  usuario.descricao,
          // password: password,
        numero:  usuario.numero,
        data:  usuario.data,
        pro: usuario.pro,
        curtida: diminui,
        urlfoto:  usuario.urlfoto,
      })
      
  };
 {/* const referenceCurtidas = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Curtidas")
    .doc();

  const enviarDados = (diminui) => {
    referenceCurtidas
      .set({
        id: auth.currentUser.uid,
       curtida: diminui,
      })
     
  };*/}

  //comentarios
  useEffect(() => {
  
    const subscriber = firestore
      .collection("Usuario")
      .doc(userID)
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

  const referenceComentarios = firestore
    .collection("Usuario")
    .doc(userID)
    .collection("Comentarios")
    .doc();

  const enviarDados1 = () => {
    referenceComentarios
      .set({
        nome: usuariocli.nome,
        texto: texto,
        urlfoto: usuariocli.urlfoto,
      })
     
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.alinhamentoLinha}>
        <TouchableOpacity
          activeOpacity={0.7}
        onPress={()=>//Abrir({servicoID:item.id}) 
                navigation.navigate("TelaServico", { servicoID: item.id, userpro:item.pro, userID:userID })
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
  
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1, backgroundColor:"white"}}>
       <TopNav style={{position:"relative"}}
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
      <ScrollView >
      <View style={{margin:10}}>
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
         
        
        <Text style={{ fontSize: 18, marginTop: 30, textAlign: "right", marginLeft:100,}}>
          {usuario.nome}
          </Text>
          {usuario.pro === true && (
            <Text style={{color: "gray", textAlign: "right", marginLeft:100,}}>Profissional</Text>
            
          )}
        <Text style={styles.text}>{usuario.numero}</Text>
        <Text style={styles.text}>{usuario.email}</Text>
        <Text style={{color: "gray", marginTop:20}}>Sobre:</Text>
        <Text style={styles.text2}>{usuario.descricao}</Text>
      
     <View style={{flexDirection:"row"}}>
  
     <Text style={{marginTop:10, fontSize:20}}>{usuario.curtida}</Text>
        {like === true && (
            <Ionicons
            name="heart"
            size={30}
            color={"#EF8F86"}
            style={{position:"relative", marginTop:5}}
            onPress={() => {
              setLike(false);
              const diminui = usuario.curtida - 1;
              setCurtida(diminui);
              salvar(diminui);
            }}
          />          
          )}
          {like === false && (
            <View>
            <Ionicons
            name="heart-outline"
            size={30}
            color={"gray"}
            style={{position:"relative", marginTop:5}}
            onPress={() => {
              setLike(true);
              const diminui = usuario.curtida + 1;
              setCurtida(diminui);
              salvar(diminui);
            }}
          />
          
          </View>
          )}
          
          </View>
          <View style={{flexDirection:"row", marginTop:10}}>
          <Ionicons name="pin" size={25} color={"black"}/>
            <Text style={{marginLeft:5, fontSize:20}}>Endereços</Text>
            </View>

        <ScrollView
        style={{ flex: 1 }}
        directionalLockEnabled={false}
        horizontal={true}>
          
        <Mapa />
        
        </ScrollView>
          
        <View style={{flexDirection:"row", marginTop:10}}>
          <Ionicons name="images" size={25} color={"#EF8F86"}/>
            <Text style={{marginLeft:5, fontSize:20}}>Serviços</Text>
            </View>
<FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          //  ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
{/*<ListarServico />*/}
<View style={{ backgroundColor: "white",
  }}>
<View style={{flexDirection:"row", marginTop:60}}>
          <Ionicons name="chatbox-ellipses" size={25} color={"#EF8F86"}/>
            <Text style={{marginLeft:5, fontSize:20}}>Comentários</Text>
            </View>
<FlatList
          data={comentarios}
          keyExtractor={(item) => item.id}
          //  ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemViewCom}
        />


                  <TextInput
                    containerStyle={{ marginTop: 15 }}
                    multiline
                    numberOfLines={10}
                    value={texto}
                    placeholder="Digite seu cometário"
                    autoCorrect={false}
                    onChangeText={(text) => setTexto(text)}
                    rightContent={
                      <Ionicons
                        name="send"
                        size={20}
                        color={themeColor.gray300}
                        onPress={() => {
                          enviarDados1()
                        }}
                      />
                    }
                  />

    </View>

            
        </View>
        </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
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
    backgroundColor: "white",
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
  image1: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 15,
  },

  screen: {
    flex: 1,
    //justifyContent: "center",
   // alignItems: "center",
   //marginTop:50,
   margin: 15,
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


