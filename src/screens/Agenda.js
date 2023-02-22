import React from "react";
import { useState, useEffect } from "react";
import { View, Image, SafeAreaView } from "react-native";
import {
  Layout,
  Text,
  TopNav,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import AgendaScreen from "./AgendaScreen";
import Timeline from "react-native-timeline-flatlist";
import { auth, firestore } from "../../firebase";
import { DatePicker } from "react-native-week-month-date-picker";
import { addDays } from "date-fns";

export default function ({ navigation }) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [dadosFiltrados, setdadosFiltrados] = useState([]);
  const { isDarkmode, setTheme } = useTheme();
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const subscriber = firestore
      .collection("Usuario")
      .doc(auth.currentUser.uid)
      .collection("Agendamento")
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

  const searchFilter = (text) => {
    if (text) {
      const newData = usuarios.filter(function (item) {
        if (item.nome) {
          const itemData = item.nome.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
      setdadosFiltrados(newData);
      setSearch(text);
    } else {
      setdadosFiltrados(usuarios);
      setSearch(text);
    }
  };

  const data = [
    {
      time: "09/05",
      title: "Maquiagem",
      description: "09:00",
    },
    { time: "10:45", title: "Event 2", description: "Event 2 Description" },
    { time: "12:00", title: "Event 3", description: "Event 3 Description" },
    { time: "14:00", title: "Event 4", description: "Event 4 Description" },
    { time: "16:30", title: "Event 5", description: "Event 5 Description" },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ backgroundColor: "white" }}>
        <Text> </Text>
        <Text> </Text>
      </View>
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
      <Timeline
        data={agendamentos}
        circleSize={20}
        circleColor="#ff9797"
        lineColor="rgb(45,156,219)"
        timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "#ff9797",
          color: "white",
          padding: 20,
          borderRadius: 13,
        }}
        descriptionStyle={{ color: "gray" }}
        options={{
          style: { paddingTop: 5 },
        }}
        isUsingFlatlist={true}
      />
      {/*   <AgendaScreen />*/}

      <DatePicker
        startDate={new Date()}
        maxFutureDays={90}
        markedDates={[new Date(), addDays(new Date(), 2)]}
        onDateChange={(date) => setSelectedDate(date)}
        theme={{
          primaryColor: "purple",
        }}
      >
        <View>
          <Text>Timeslots</Text>
          <Text>{selectedDate.toString()}</Text>
        </View>
      </DatePicker>
    </View>
  );
}
