import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import messages from './Screens/Messages';
import WithdrawMoney from './Screens/WithdrawMoney';
import { HomeIcon, MessageCircleMore, Wallet } from 'lucide-react-native';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true, // Show the tab labels
        tabBarStyle: {
          position: 'absolute', // Ensure it's positioned at the bottom
          height: '7%', // Custom height
          backgroundColor: 'transparent', // Transparent background for the tab bar
          borderTopWidth: 0, // Remove the border for better transparency
        },
        tabBarLabelStyle: ({ focused }) => ({
          fontSize: 12, // Customize the font size of the labels
          fontWeight: 'bold', // Customize the font weight
          color: focused ? '#ffffff' : '#131131', // Customize the label color based on focus state
          marginTop: -5, // Adjust the margin to reduce gap with the icon
          marginBottom: 0, // Remove any bottom margin if present
          textAlign: 'center', // Center the text horizontally
        }),
        tabBarItemStyle: {
          paddingVertical: 5, // Adjust vertical padding to control spacing
        },
        tabBarActiveTintColor: '#fff', // Active color for icons
        tabBarInactiveTintColor: '#7B828A', // Inactive color for icons
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <HomeIcon color={focused ? '#fff' : '#7B828A'} />
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
            <View>
              <MessageCircleMore color={focused ? '#fff' : '#7B828A'} />
            </View>
          ),
          headerShown: false, // Hides the header for the "Profile" screen
        }}
      />
      <Tab.Screen
        name="Money"
        component={WithdrawMoney}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Wallet color={focused ? '#fff' : '#7B828A'} />
            </View>
          ),
          headerShown: false, // Hides the header for the "Profile" screen
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="BottomTabs">
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
}

export default App;
