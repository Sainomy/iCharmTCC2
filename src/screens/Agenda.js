import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
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
  const [search, setSearch] = useState("");

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
  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <Text>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  const searchFilter = (formattedDate) => {
    if (formattedDate) {
      const newData = agendamentos.filter(function (item) {
        if (item.data) {
          const itemData = item.data;
          const textData = formattedDate;
          return itemData.indexOf(textData) > -1;
        }
      });
      const ordemData = newData.sort(function (a, b) {
        return new Date(b.time) - new Date(a.time);
      });
      setdadosFiltrados(ordemData);
      setSearch(formattedDate);
      //   console.log("text " + formattedDate);
    } else {
      setdadosFiltrados(agendamentos);
      setSearch(formattedDate);
      // console.log("text " + formattedDate);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
      <View>
        <TextInput
          style={{
            margin: 10,
            textAlign: "center",
            fontSize: 20,
            color: "#D76348",
          }}
          borderRadius={15}
          onChangeText={(text) => searchFilter(text)}
          value={selectedDate}
          underlineColorAndroid="transparent"
          placeholder="Dia/Mês/Ano"
        ></TextInput>

        {/*   <AgendaScreen />*/}
        {/*<FlatList data={dadosFiltrados} renderItem={ItemView} />*/}
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
          style: { paddingTop: 5 },
        }}
        isUsingFlatlist={true}
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
          console.log(formattedDate);
          setSelectedDate(formattedDate);
          //  setSearch(selectedDate);
          //    let muda = formattedDate;
          searchFilter(formattedDate);
          // const data = formattedDate;
          //  setSelectedDate(formattedDate);
          //  console.log("console date agora " + formattedDate + selectedDate);
        }}
        theme={{
          primaryColor: "#D76348",
        }}
      ></DatePicker>
    </SafeAreaView>
  );
}
