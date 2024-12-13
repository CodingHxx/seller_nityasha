import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import messages from './Screens/Messages';
import Profile from './Screens/Profile';
import { HomeIcon, MessageCircleMore, Wallet, CircleUser, ChartPie } from 'lucide-react-native';
import { View } from 'react-native';
import Login from '@/app/Screens/Login';
import SignUp from '@/app/Screens/SignUp';
import Welcome from './Screens/Welcome';
import analysis from './Screens/analysis';
import notification from './Screens/notification';
import Analysis from './Screens/analysis';
import Payment from '@/components/Payment';
import Vemail from '@/app/Screens/Vemail';
import ChatScreen from './Screens/ChatScreen';
import EditProfile from './Screens/EditProfile';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import Pvt from '@/app/Screens/pvt/index'
import { NavigationContainer } from '@react-navigation/native';
import Widowable from '@/app/Screens/Widowable';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.black,
          position: "absolute",
          bottom: 10,
          justifyContent: "center", // Center vertically
          alignItems: "center", // Center horizontally
          alignSelf: "center",
          height: 63,
          marginHorizontal: 30,
          paddingVertical: 8,
          paddingBottom: 8,
          borderRadius: 40,  paddingTop: 10,
          borderWidth: 1,
          borderTopWidth: 1,
          width: "80%",
          borderColor: "#333",
          borderTopColor: "#333",
        },        
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#999",
        tabBarActiveTintColor: Colors.white,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              padding: 10,
              borderRadius: 30,
              backgroundColor: focused ? Colors.white : Colors.black,
            }}>
              <HomeIcon color={focused ? '#000' : '#7B828A'} />
            </View>
          ),
          headerShown: false, // Hides the header for the "Home" screen
        }}
      />
      <Tab.Screen
        name="Messages"
        component={messages}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              padding: 10,
              borderRadius: 30,
              backgroundColor: focused ? Colors.white : Colors.black,
            }}>
              <MessageCircleMore color={focused ? '#000' : '#7B828A'} />
            </View>
          ),
          headerShown: false, // Hides the header for the "Profile" screen
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={Analysis}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              padding: 10,
              borderRadius: 30,
              backgroundColor: focused ? Colors.white : Colors.black,
            }}>
              <ChartPie color={focused ? '#000' : '#7B828A'} />
            </View>
          ),
          headerShown: false, // Hides the header for the "Profile" screen
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              padding: 10,
              borderRadius: 30,
              backgroundColor: focused ? Colors.white : Colors.black,
            }}>
              <CircleUser color={focused ? '#000' : '#7B828A'} />
            </View>
          ),
          headerShown: false, // Hides the header for the "Profile" screen
        }}
      />
    </Tab.Navigator>
  );
}

const IndexPage: React.FC = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Analysis" component={analysis} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Notification" component={notification} />
        <Stack.Screen name="Vemail" component={Vemail} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Pvt" component={Pvt} />
        <Stack.Screen
          name="ChatScreen" component={ChatScreen} />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            presentation: "transparentModal",
            animation: "slide_from_bottom",
            animationTypeForReplace: "pop",
            headerShown: false,
          }}
        />
          <Stack.Screen name="Widowables" component={Widowable} />
      </Stack.Navigator>
  );
}

export default IndexPage;
