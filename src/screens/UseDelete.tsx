import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { getAuth, signOut  } from "firebase/auth";
import {
  Text,
  Section,
  SectionContent,
  TopNav,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { auth, firestore, storage } from "../../firebase";
import { Divider} from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function UseDelete({ navigation }) {
  const auth = getAuth();
  const { isDarkmode, setTheme } = useTheme();
 
 
 {/* const deletarUsuario = async () => {
    var user = auth.currentUser;
  
    user.delete().then(function(){
      navigation.navigate("Login");
      //User deleted.
    }).catch(function(error){});
  }*/}
  const deletarUsuario = async () => {
    var user = auth.currentUser;
    const reference =
      firestore.collection("Usuario")
      .doc(auth.currentUser.uid).delete();

      user.delete().then(function(){
        signOut(auth);
   
    //User deleted.
    }).catch(function(error){});
  };

  return (
    <View>
      <View style={{backgroundColor:"white"}}>
        <Text> </Text>
        <Text> </Text>
      </View>
    <TopNav style={{marginTop:60}}
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
     <Section style={{justifyContent:"center",
      alignItems:"center", margin:60}}>
         
        <SectionContent style={{justifyContent:"center", 
        alignItems:"center"
        }}>
          <Text style={{fontSize:25, marginVertical:20}}>Configurações</Text>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}
            style={{margin:10, alignItems:"center"}}
            
           >
            <Text>{"Suporte"}</Text>
            <Divider style={{width:300, margin:5, marginTop:20}}/>
          </TouchableOpacity> 
         
         
         <TouchableOpacity
            onPress={() => {
              deletarUsuario();
            }}
            >
            <Text style={{color:"red"}}>{"Excluir Conta"}</Text>
          </TouchableOpacity>

        </SectionContent>
     </Section>
     </View>
  );
}
