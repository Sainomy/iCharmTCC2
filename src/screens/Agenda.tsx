import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Layout,
  Text,
  TopNav,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import Timeline from "react-native-timeline-flatlist";
import { auth, firestore } from "../../firebase";
import { DatePicker } from "react-native-week-month-date-picker";
import { Modalize } from "react-native-modalize";
import { Agendamento } from "../../model/Agendamento";

export default function ({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(auth.currentUser.uid);

  const [dadosFiltrados, setdadosFiltrados] = useState([]);
  const { isDarkmode, setTheme } = useTheme();
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamento, setAgendamento] = useState < Partial < Agendamento >> ({});

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Agendamento")
      .orderBy("NOrdem", "asc")
      .onSnapshot((querySnapshot) => {
        const agendamentos = [];
        querySnapshot.forEach((documentSnapshot) => {
          agendamentos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setAgendamentos(agendamentos);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const searchFilter = (formattedDate) => {
    if (formattedDate) {
      const newData = agendamentos.filter(function (item) {
        if (item.data) {
          const itemData = item.data.toUpperCase();
          const textData = formattedDate.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });

      setdadosFiltrados(newData);
      setSelectedDate(formattedDate);
      setSearch(formattedDate);
      console.log(newData);
      //   console.log("text " + formattedDate);
    } else {
      setdadosFiltrados(newData);
      setSelectedDate(formattedDate);
      setSearch(formattedDate);
      console.log(newData);

      // console.log("text " + formattedDate);
    }
  };
  const updateSelectedDate = (date: Date) => {
    onDateChange?.(date);
  };

  const enviarDadosConf = () => {
    const referenceNotificacaoPro =  firestore
    .collection("Usuario")
    .doc(agendamento.pro)
    .collection("Notificacao")
    .doc();
    referenceNotificacaoPro.set({
        id: referenceNotificacaoPro.id,
        text: "Horário foi confirmado!",
        servico: agendamento.title,
        data: agendamento.data,
        hora: agendamento.time,
        pro: agendamento.pro,
        nome: agendamento.description,
        cli: agendamento.cli,
        confir: true,
      })
      const referenceNotificacaoCli =  firestore
    .collection("Usuario")
    .doc(agendamento.cli)
    .collection("Notificacao")
    .doc();
    referenceNotificacaoCli.set({
        id: referenceNotificacaoCli.id,
        text: "Horário foi confirmado!",
        servico: agendamento.title,
        data: agendamento.data,
        hora: agendamento.time,
        pro: agendamento.pro,
        nome: agendamento.description,
        cli: agendamento.cli,
        confir: true,
      })
  };
  const enviarDadosCancel = () => {
    const referenceNotificacaoPro =  firestore
    .collection("Usuario")
    .doc(agendamento.pro)
    .collection("Notificacao")
    .doc();
    referenceNotificacaoPro.set({
        id: referenceNotificacaoPro.id,
        text: "Horário foi cancelado!",
        servico: agendamento.title,
        data: agendamento.data,
        hora: agendamento.time,
        pro: agendamento.pro,
        nome: agendamento.description,
        cli: agendamento.cli,
        confir: false,
      })
      const referenceNotificacaoCli =  firestore
      .collection("Usuario")
      .doc(agendamento.cli)
      .collection("Notificacao")
      .doc();
      referenceNotificacaoCli.set({
          id: referenceNotificacaoCli.id,
          text: "Horário foi cancelado!",
          servico: agendamento.title,
        data: agendamento.data,
        hora: agendamento.time,
        pro: agendamento.pro,
        nome: agendamento.description,
        cli: agendamento.cli,
        confir: false,
        })
  };
  
  const EventPress = (dadosFiltrados) => {
    setAgendamento(dadosFiltrados);
    console.log(agendamento.id);
    const cancelBtn: AlertButton = {
      text: "Confirmar",
      onPress: () => {{console.log(agendamento.cli); enviarDadosConf();}},
      style: 'default',
    };
    const deleteBtn: AlertButton = {
      text: "Desmarcar",
      style: 'destructive',
      onPress: () => {
        {
         enviarDadosCancel();
      const apagar = firestore
      .collection("Usuario")
      .doc(agendamento.pro)
      .collection("Agendamento")
      .doc(agendamento.id);
    apagar.delete();
    const apagar2 = firestore
      .collection("Usuario")
      .doc(agendamento.cli)
      .collection("Agendamento")
      .doc(agendamento.id);
    apagar2.delete();
        }
      },
    };

    Alert.alert((agendamento.title) + "\n" + (agendamento.data)+ "\n" + (agendamento.time),   (agendamento.description), [
      deleteBtn,
      cancelBtn,
    ]);
    
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkmode ? themeColor.dark100 : "white",
      }}
    >
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
            name="menu"
            size={30}
            color={isDarkmode ? themeColor.dark100 : "black"}
          />
        }
      />
      <DatePicker
        startDate={new Date()}
        maxFutureDays={90}
        //  markedDates={[new Date(), addDays(new Date(), 2)]}
        onDateChange={(date) => {
          console.log(date);
          let formattedDate =
            date.getDate().toString().padStart(2, "0") +
            "/" +
            (date.getMonth() + 1).toString().padStart(2, "0") +
            "/" +
            date.getFullYear();
          setSelectedDate(date);
          console.log(formattedDate);
          searchFilter(formattedDate);
        }}
        theme={{
          primaryColor: "#D76348",
          backgroundColor: isDarkmode ? themeColor.dark100 : "white",
        }}
      >
        <View>
          <TextInput
            style={{
              margin: 10,
              textAlign: "center",
              fontSize: 20,
              color: "#D76348",
            }}
            borderRadius={15}
            onChangeText={(text) => {
              searchFilter(text);
              //compareValues(text);
            }}
            value={selectedDate}
            underlineColorAndroid="transparent"
            placeholder="Dia/Mês/Ano"
          ></TextInput>

        </View>

        <Timeline
          data={dadosFiltrados}
          circleSize={20}
          circleColor="#D76348"
          lineColor="#ff9797"
          timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
          timeStyle={{
            textAlign: "center",
            backgroundColor: "#D76348",
            color: "white",
            padding: 10,
            borderRadius: 13,
            marginTop: 10,
            marginLeft: 10,
          }}
          descriptionStyle={{ color: "gray" }}
          options={{
            style: { paddingTop: 5, marginLeft: 20 },
          }}
          isUsingFlatlist={true}
          onEventPress={EventPress}
        />
      </DatePicker>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image1: {
    width: 320,
    height: 220,
    borderRadius: 20,
    borderColor: "#ef846c",
    marginRight: 10,
  },
  containerSafeArea: {
    flex: 1,
  },
  itemStylee: {
    fontSize: 20,
    padding: 5,
    marginTop: 2,
  },
  itemStyle: {
    fontSize: 18,
    padding: 0,
    margin: 5,
    color: "gray",
  },
  alinhamentoLinha: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "white",
    margin: 12,
    borderRadius: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: "#d3d3d3",
    borderWidth: 0.5,
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 15,
  },
});
