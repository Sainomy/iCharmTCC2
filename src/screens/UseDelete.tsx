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
import { fontSize } from "react-native-rapi-ui/constants/typography";

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
    const user = auth.currentUser;
  //  const reference =
 //    await firestore.collection("Usuario")
   //   .doc(auth.currentUser.uid);

   //   reference.delete();
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
      <Text style={{margin:15, fontSize:14}}>C O N F I G U R A C Õ E S</Text>
    }
    leftContent={
      <Ionicons
        name="chevron-back"
        size={20}
        color={isDarkmode ? themeColor.white100 : themeColor.black}
      />
    }
    leftAction={() => navigation.goBack()}
    rightContent={
      <Ionicons
        name="cog"
        size={25}
        color={"black"}
      />}
  />
     <Section style={{justifyContent:"center",
      alignItems:"center", margin:60}}>
         
        <SectionContent style={{justifyContent:"center", 
        alignItems:"center"
        }}>
         
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
            <Text style={{color:"red", marginTop:5}}>{"Excluir Conta"}</Text>
          </TouchableOpacity>

        </SectionContent>
     </Section>
     </View>
  );
}
