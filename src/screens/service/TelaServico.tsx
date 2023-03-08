import { useNavigation, useRoute} from "@react-navigation/core";
import React, {  useState, useEffect, useRef } from "react";
import { Dimensions,View, StyleSheet, Image, Alert, Pressable, TouchableOpacity, TextInput,
  FlatList,  AlertButton,} from "react-native";
import { auth, firestore, storage,} from "../../../firebase";
import { Usuario } from "../../../model/Usuario";
import { Servico } from "../../../model/Servico";
import { Foto } from "../../../model/Foto"
import Ionicons from "@expo/vector-icons/Ionicons";
import { Layout, TopNav, Button, Text,useTheme ,themeColor, Section, SectionContent} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";
import { ScrollView } from "react-native-gesture-handler";
import { Agendamento } from "../../../model/Agendamento";
import { Divider} from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function TelaServico({navigation} ) {
  const { isDarkmode } = useTheme();
  const modalizeRef = useRef(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [hora, setHora] = useState("");
  const [data, setData] = useState("");
  const [dataString, setDataString] = useState("");
  const [NOrdem, setNOrdem] = useState(Number);
  const [pro, setPro] = useState("");
  const [cli, setCli] = useState(auth.currentUser.uid);
  const [nomecli, setNomeCli] = useState("");

  const [servico, setServico] = useState  < Servico >({});
  const [usuario, setUsuario] = useState  < Usuario >({});
  const [usuariocli, setUsuarioCli] = useState  < Usuario >({});
  const [horarios, setHorarios] = useState ([ ]);
  const [fotos, setFotos] = useState < Foto > ({});

 { /*function onOpen() {
    modalizeRef.current?.open();
  }*/}
  const route = useRoute();
  const {servicoID}=  route.params
  const {userpro} = route.params

  const [pickedImagePath, setPickedImagePath] = useState("");
  const [pickedImagePath2, setPickedImagePath2] = useState("");
  useEffect(() => {
     const subscriber =  firestore
      .collection("Usuario")
      .doc(userpro)
      .collection("Servico")
      .doc(servicoID)
      .onSnapshot((documentSnapshot) => {
        setServico(documentSnapshot.data());
        if (servico.urlfoto == null) {
          setPickedImagePath("");
        } else {
          setPickedImagePath(servico.urlfoto);
        }
      });
    return () => subscriber();
  }, [servico]);


  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(userpro)
      .collection("Servico")
      .doc(servicoID)
      .collection("Foto")
      .onSnapshot((querySnapshot) => {
        const fotos = [];
        querySnapshot.forEach((documentSnapshot) => {
          fotos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setFotos(fotos);
      });
  
    return () => subscriber();
  }, [fotos]);

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(userpro)
      .onSnapshot((documentSnapshot) => {
        setUsuario(documentSnapshot.data());
        if (usuario.urlfoto == null) {
          setPickedImagePath2("");
        } else {
          setPickedImagePath2(usuario.urlfoto);
        }
       
      });
    return () => subscriber();
  }, [usuario]);

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        setUsuarioCli(documentSnapshot.data());
       setNomeCli(usuariocli.nome)
       
      });
    return () => subscriber();
  }, [usuariocli]);

const LongClickF=(item)=>{
  const cancelBtn: AlertButton = {
    text: "Voltar",
    onPress: () => {
      navigation.goBack()
    },
  };
  const deleteBtn: AlertButton = {
    text: "Apagar",
    onPress: () => {
      const ApgFoto = firestore
  .collection("Usuario")
  .doc(auth.currentUser.uid)
  .collection("Servico")
  .doc(servicoID)
  .collection("Foto")
  .doc(item.id);

  ApgFoto.delete();

    },
  };

  Alert.alert(
    `Deseja apagar a foto?`,
    " ou voltar?",
    [deleteBtn, cancelBtn]
  );
 };


  const ItemView = ({ item }) => {
    return (
        <TouchableOpacity
          activeOpacity={0.7}
          onLongPress={() => { LongClickF(item) }}
        >
          <Image style={styles.image2} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>
    );
  };

 
  return (
    <Layout>
      <TopNav
        middleContent={
          <Image
            source={require("../../../assets/nome.png")}
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
 
    <ScrollView style={styles.screen}>
    <View style={ {shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3, borderRadius:20,
    justifyContent: "center", alignItems:"center"}}>
     <Section style={{margin:20}}>
     <SectionContent style={{
   }}>

            {pickedImagePath !== "" && (
              <Image source={{ uri: servico.urlfoto }} style={styles.image} />
            )}
            {pickedImagePath === "" && (
              <Image
                source={require("../../../assets/usuario.png")}
                style={styles.image}
              />
            )}
          
        <Text style={{fontSize: 30, fontStyle:"italic", margin:5, alignItems:"flex-start"}}>{servico.nomecat}</Text>
            <Text style={{color:"gray"}}>{servico.descricao}</Text>
            <Text style={{color:"green", textAlign:"left"}}>R${servico.valor}</Text>
            <Text style={{color:"gray", textAlign:"right", marginTop:-22 }}>Tempo: {servico.tempo}</Text>
            <Button
              color="#EF8F86"
              rightContent={
                <Ionicons
                    name="create"
                    size={20}
                    color={themeColor.white}
                />}
            
              onPress={() => {
                navigation.navigate("EditServico", {servicoID:servicoID});
              }}
              style={{
                position: "absolute",
                backgroundColor: "#E8A998",
                right:1,
                margin:10,
              }}
            />
            </SectionContent>
            </Section>
            </View>
        
            <Text style={{marginLeft:20, color:"gray"}}>Fotos de {servico.nomecat}</Text>
      <ScrollView
      style={{flex: 1, marginTop:15}}
      directionalLockEnabled={false}
      horizontal={true}>
        
      <FlatList
        numColumns={50}
        data={fotos}
        renderItem={ ItemView}
      />
      <Ionicons
              name="images"
              size={60}
              color={"black"}
              style={{alignItems:"center", padding:40}}
              onPress={() => {
                navigation.navigate("AddFotos",{servico:servico});
               }}
            />
    </ScrollView>
   
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    width: 310,
    height: 300,
   borderRadius: 20,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
  },
  image2: {
    width: 210,
    height: 150,
    borderRadius: 20,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  image3: {
    margin:5,
    width: 100,
    height: 90,
    borderRadius: 150 / 2,
    resizeMode: "cover",
    borderColor: "#ef846c",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
});
