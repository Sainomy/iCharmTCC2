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
import { auth, firestore, firebase } from "../../firebase";
import { DatePicker } from "react-native-week-month-date-picker";
import { addDays } from "date-fns";
import { todayString } from "react-native-calendars/src/expandableCalendar/commons";

export default function ({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
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
      // .where("data", "==", search)
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

  {
    /* useEffect(() => {
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
*/
  }
  const ItemView = ({ item }) => {
    return (
      <View style={styles.alinhamentoLinha}>
        <Text style={{ padding: 20, color: "#D76348" }}>{item.time}</Text>

        <View style={styles.alinhamentoColuna}>
          <Text style={styles.itemStylee}>{item.title} </Text>
          <Text style={styles.itemStyle}>{item.description} </Text>
        </View>
      </View>
    );
  };

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
  const onRefresh = () => {
    setRefreshing(true);
    setdadosFiltrados([]);
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
          //  setSelectedDate(formattedDate);
          //  setSearch(selectedDate);
          //    let muda = formattedDate;
          searchFilter(formattedDate);
          //  setSearch(formattedDate);
          // const data = formattedDate;
          //  setSelectedDate(formattedDate);
          //  console.log("console date agora " + formattedDate + selectedDate);
        }}
        theme={{
          primaryColor: "#D76348",
          backgroundColor: "white",
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

          {/*   <AgendaScreen />*/}
          <FlatList
            data={dadosFiltrados}
            renderItem={ItemView}
            //  refreshControl={
            //    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            //  }
          />
        </View>
        {/*<Timeline
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
      />*/}
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
  alinhamentoColuna: {
    //  flexDirection: "column",
    //  justifyContent: "flex-start",
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 15,
  },

  // separador: {
  //   height: 1,
  //   width: "100%",
  // },
});
