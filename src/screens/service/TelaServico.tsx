import { useNavigation, useRoute} from "@react-navigation/core";
import React, {  useState, useEffect, useRef } from "react";
import { Dimensions,View, StyleSheet, Image, Alert, Pressable, TouchableOpacity, TextInput,
  FlatList,  AlertButton,} from "react-native";
import { auth, firestore, storage } from "../../../firebase";
import { Usuario } from "../../../model/Usuario";
import { Servico } from "../../../model/Servico";
import { Foto } from "../../../model/Foto"
import Ionicons from "@expo/vector-icons/Ionicons";
import { Layout, TopNav, Button, Text,useTheme ,themeColor, Section, SectionContent} from "react-native-rapi-ui";
import { Modalize } from "react-native-modalize";
import { ScrollView } from "react-native-gesture-handler";
import { Agendamento } from "../../../model/Agendamento";
import { Divider} from 'react-native-paper';


export default function TelaServico({navigation} ) {
  const { isDarkmode } = useTheme();
  const modalizeRef = useRef(null);
 
  const [hora, setHora] = useState("");
  const [data, setData] = useState("");
  const [pro, setPro] = useState("");
  const [cli, setCli] = useState(auth.currentUser.uid);
  const [agendamento, setAgendamento] = useState({
    id: "",
    item: [],
  });

  const [servico, setServico] = useState  < Servico >({});
  const [usuario, setUsuario] = useState  < Usuario >({});
  const [fotos, setFotos] = useState < Foto > ({});
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });

 { /*function onOpen() {
    modalizeRef.current?.open();
  }*/}
  const route = useRoute();
  const {servicoID}=  route.params
  const {userpro} = route.params
  const [service, setService] = useState(servicoID);

  const [pickedImagePath, setPickedImagePath] = useState("");
  const [pickedImagePath2, setPickedImagePath2] = useState("");
  useEffect(() => {
     const subscriber =  firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
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
      .doc(auth.currentUser.uid)
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
    // Unsubscribe from events when no longer in use
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

  const referenceAgendamento = firestore
  .collection("Usuario")
  .doc(auth.currentUser.uid)
  .collection("Endereco")
  .doc();

const enviarDados = () => {
  referenceAgendamento
    .set({
      id: referenceAgendamento.id,
      hora: hora,
      data: data,
      service:service,
      pro: userpro,
      cli: cli,
    })
    .then(() => {
      const cancelBtn: AlertButton = {
        text: "Acompanhar agendamento",
        onPress: () => {
          navigation.navigate("Profile");
        },
      };
      const deleteBtn: AlertButton = {
        text: "Voltar",
        onPress: () => {
          navigation.navigate("Endereco");
        },
      };

      Alert.alert(
        `Aguarde a confirmação do agendamento!`,
        " ou voltar?",
        [deleteBtn, cancelBtn]
      );
    });
};

  const ItemView = ({ item }) => {
    return (
        <TouchableOpacity
          activeOpacity={0.7}
        >
          <Image style={styles.image2} source={{ uri: item.urlfoto }} />
        </TouchableOpacity>
    );
  };

  function onOpen() {
    modalizeRef.current?.open();
  }
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      hora: '9:00',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      hora: '10:00',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      hora: '11:00',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d71',
      hora: '14:00',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      hora: '15:00',
     },
     {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      hora: '16:00',
     },
     {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      hora: '17:00',
     },
     {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      hora: '18:00',
     },
  ];
 
    let [selectedId, setSelectedId] = useState(null);
  
    const LongClick=(item)=>{
      alert('voce pressionou longo e '+ item.hora);
     }
   
     const shortClick=(item)=>{
      alert('voce pressionou curto e '+ item.hora);
      setHora(item.hora);
     };
     const ItemView2 = ({ item }) => {
      return (
        <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onLongPress={() => { LongClick(item) }}
        onPress={() => { shortClick(item) }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}> {item.hora}</Text>
        </View>
    </Pressable>
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
 
   <Modalize ref={modalizeRef} snapPoint={500}>
      <View
        style={{
          flex: 1,
          height: 500,
        //  justifyContent: "center",
         //alignItems: "center",
          backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
        }}
      >
        <View style={{ alignItems:"center", marginTop:15}}>
         {usuario.urlfoto !== "" && (
            <Image source={{ uri: usuario.urlfoto }} style={styles.image3} />
          )}
          {usuario.urlfoto === "" && (
            <Image
              source={require("../../../assets/usuario.png")}
              style={styles.image3}
            />
          )}
        
        <Text style={{fontSize:18}}>{usuario.nome}</Text>
        <Divider style={{width:"100%", margin:5, marginTop:20}}/>
        
        <Text style={{ fontSize:20, margin:10}}>{servico.nomecat} ....................             
         R${servico.valor}</Text>
         </View>
        <Divider style={{width:"100%", margin:5, marginTop:20}}/>

        <Text style={{margin:10}}> Data: </Text>
        
        <Divider />

        <View style={{margin:10}}>
        <Text style={{fontSize:20}}>Horário: {hora}</Text>

        <ScrollView  
      directionalLockEnabled={false}
      horizontal={true}>
        <FlatList
        numColumns={5}
        data={DATA}
        renderItem={ItemView2}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
        </ScrollView>

        <TouchableOpacity
          onPress={enviarDados}
          style={{
            backgroundColor: "white",
            borderRadius: 6,
            padding: 15,
            borderWidth: 1,
            borderColor: "rgba(0,0,0, 0.2)",
            margin:20,
            marginLeft:40,
            marginRight:40,
          }}
        >
          <Text>Agendar</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modalize>
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
            <Text style={{color:"green"}}>R${servico.valor}</Text>
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
    <View style={{marginRight:60, marginLeft:60, marginTop:10}}>
        <Button
          color="#EF8F86"
          text="Adicionar mais Fotos"
          onPress={() => {
            navigation.navigate("AddFotos",{servico:servico});
           }}
           leftContent={
            <Ionicons
              name="images"
              size={30}
              color={isDarkmode ? themeColor.white100 : themeColor.white}         
            />
        }
        />    
        <Button
          color="#EF8F86"
          text="Marcar Horário"
          onPress={onOpen}
          style={{
            marginTop: 10,
            backgroundColor: "#E8A998",
          }}
          leftContent={
            <Ionicons
              name="calendar"
              size={30}
              color={isDarkmode ? themeColor.white100 : themeColor.white}  
            />
        }
        />
        </View>
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
