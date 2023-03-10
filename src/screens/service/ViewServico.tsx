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
  const [nomepro, setNomePro] = useState("");

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
  const {userID} = route.params
  const [service, setService] = useState(servicoID);


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
 
  
const enviarDados = () => {
  const referenceAgendamento =  firestore
  .collection("Usuario")
  .doc(auth.currentUser.uid)
  .collection("Agendamento")
  .doc();
  referenceAgendamento.set({
      id: referenceAgendamento.id,
      description: usuario.nome,
      time: hora,
      title:servico.nomecat,
      data: dataString,
      NOrdem: NOrdem,
      pro: userpro,
      cli: cli,
      nomecli: usuariocli.nome,
    }).then(() => {
      const cancelBtn: AlertButton = {
        text: "Visualizar o agendamento",
        onPress: () => {
          navigation.navigate("Agenda");
        },
      };
      const deleteBtn: AlertButton = {
        text: "Voltar",
        onPress: () => {
          navigation.goBack()
        },
      };

      Alert.alert(
        `Aguarde a confirma????o do agendamento!`,
        " ou voltar?",
        [deleteBtn, cancelBtn]
      );
    });

};

const enviarDadosPro = () => {
  const referenceAgendamentoPro =  firestore
  .collection("Usuario")
  .doc(userpro)
  .collection("Agendamento")
  .doc();
  referenceAgendamentoPro.set({
      id: referenceAgendamentoPro.id,
      description: usuariocli.nome,
      time: hora,
      title:servico.nomecat,
      data: dataString,
      NOrdem: NOrdem,
      pro: userpro,
      cli: cli,
      nomepro: usuario.nome,
    })

};



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

  function onOpen() {
    modalizeRef.current?.open();
  }
  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(userpro)
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
  }, []);
 
    let [selectedId, setSelectedId] = useState(null);
  
    
     const ItemView2 = ({ item }) => {
      return (
       <ScrollView  
        directionalLockEnabled={false}
              horizontal={true}>
           <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => {  setHora(item.hora8); setNOrdem(8);}}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora8}  </Text>
           
        </View>
    </Pressable>
        <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora9); setNOrdem(9); }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}> {item.hora9} </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora10); setNOrdem(10); }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora10}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora11); setNOrdem(11); }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora11}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => {setHora(item.hora12);  setNOrdem(12);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora12}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora13);  setNOrdem(13); }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora13}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora14);  setNOrdem(14);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora14}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => {setHora(item.hora15); setNOrdem(15);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora15}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora16); setNOrdem(16);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora16}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora17); setNOrdem(17);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora17}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => {setHora(item.hora18);  setNOrdem(18);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora18}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora19); setNOrdem(19);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora19}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora20); setNOrdem(20);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora20}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => {setHora(item.hora21); setNOrdem(21);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora21}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora22); setNOrdem(22);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora22}  </Text>
           
        </View>
    </Pressable>
    <Pressable
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent'}]}
        onPress={() => { setHora(item.hora23); setNOrdem(23);  }}
    >
        <View>
            <Text style={{margin:10, color: "gray"}}>  {item.hora23}  </Text>
           
        </View>
    </Pressable>
    </ScrollView>
      );
    };
    
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const handleConfirm = (date) => {
   // console.warn("A data foi selecionada: " + date);
    const formattedDate =
      date.getDate().toString().padStart(2, "0") +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getFullYear();
    console.log(formattedDate);
    setDataString(formattedDate);
    setData(date.toString());
    hideDatePicker();
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
 
   <Modalize ref={modalizeRef} snapPoint={560}>
    
      <View
        style={{
          flex: 1,
          height: 560,
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
        <Text style={{margin:10, fontSize:20}}> Data: {dataString}</Text>
        <Button
              title="Calend??rio"
              style={{ width: 25 }}
              text="Calend??rio"
              color={"#EF8F86"}
              leftContent={
                <Ionicons name="calendar" size={20} color={"white"}>
                  {" "}
                </Ionicons>
              }
              onPress={showDatePicker}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
       
       
        

        <View style={{margin:10}}>
        <Divider />
        <Text style={{fontSize:20, marginTop:15}}>Hor??rio: {hora}</Text>

    { /*   <ScrollView  
      directionalLockEnabled={false}
            horizontal={true}>*/}
        <FlatList
        numColumns={5}
        data={horarios}
        renderItem={ItemView2}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    {  /*</ScrollView>*/}
        <Button
              color="#EF8F86"
              style={{ marginTop: 20 }}
              text="Agendar"
              onPress={() => {enviarDados(); enviarDadosPro();}}
            />
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
            <Text style={{color:"green", textAlign:"left"}}>R${servico.valor}</Text>
            <Text style={{color:"gray", textAlign:"right", marginTop:-22 }}>Tempo: {servico.tempo}</Text>
            
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
    
    </ScrollView>
    <View style={{marginRight:60, marginLeft:60, marginTop:10}}>      
        <Button
          color="#EF8F86"
          text="Marcar Hor??rio"
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
