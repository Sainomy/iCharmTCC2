import React, { useContext } from "react";
import { initializeApp, getApps } from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useTheme, themeColor } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";
import Loading from "../screens/utils/Loading";
//Screens
import Home from "../screens/Home";
import Agenda from "../screens/Agenda";
import Profile from "../screens/Profile";
import ListarUsuario from "../screens/ListarUsuario";
import UseDelete from "../screens/UseDelete";
import ProfileView from "../screens/ProfileView";
//import Agendamento from "../screens/Agendamento";
//Service
import AddServico from "../screens/service/AddServico";
import ListarServico from "../screens/service/ListarServico";
import TelaServico from "../screens/service/TelaServico";
import AddFotos from "../screens/service/AddFotos";
import EditProfile from "../screens/EditProfile";
import EditServico from "../screens/service/EditServico";
//Endereco
import Mapa from "../components/utils/Mapa";
import Endereco from "../screens/Endereco";
//import Welcome from "../screens/layout/Welcome";
// Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import { AuthContext } from "../provider/AuthProvider";

// Better put your these secret keys in .env file
const firebaseConfig = {
  apiKey: "AIzaSyDVU249wFBwwvpxh5W8RFXO0Zx2Jiwb-a4",
  authDomain: "crudteste-68ba4.firebaseapp.com",
  projectId: "crudteste-68ba4",
  storageBucket: "crudteste-68ba4.appspot.com",
  messagingSenderId: "865693431095",
  appId: "1:865693431095:web:8d677c4e756cae824d96b2",
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <AuthStack.Screen name="Welcome" component={Welcome} />*/}
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="AddServico" component={AddServico} />
      <MainStack.Screen name="ListarServico" component={ListarServico} />
      <MainStack.Screen name="TelaServico" component={TelaServico} />
      <MainStack.Screen name="Endereco" component={Endereco} />
      <MainStack.Screen name="AddFotos" component={AddFotos} />
      <MainStack.Screen name="EditProfile" component={EditProfile} />
      <MainStack.Screen name="Mapa" component={Mapa} />
      <MainStack.Screen name="EditServico" component={EditServico} />
      <MainStack.Screen name="ListarUsuario" component={ListarUsuario} />
      <MainStack.Screen name="UseDelete" component={UseDelete} />
      <MainStack.Screen name="ProfileView" component={ProfileView} />
      {/* <MainStack.Screen name="Agendamento" component={Agendamento} />*/}
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#E6E6E6",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Agenda"
        component={Agenda}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Agenda" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-calendar-outline"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  return (
    <NavigationContainer>
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user == true && <Main />}
    </NavigationContainer>
  );
};
