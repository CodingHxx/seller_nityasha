import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  RefreshControl,
  ActivityIndicator, // Import RefreshControl
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ChartPie, Bell, Orbit, Gem, Magnet, IndianRupee } from 'lucide-react-native';
import { useFonts, Urbanist_600SemiBold, Urbanist_800ExtraBold } from '@expo-google-fonts/urbanist';
import { useNavigation } from '@react-navigation/native';
import Userinfod from '@/components/userinfod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessagesPending from '@/components/MessagesPending';
import MessagesPendingH from '@/components/MessagesPendingH';
import * as Notifications from 'expo-notifications';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(Array(6).fill(0).map(() => new Animated.Value(0))).current;
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  const navigation = useNavigation();

  // Fetch userId from AsyncStorage and call API
  const fetchConsultants = async () => {
    setLoading(true); // Set loading true at the start of the fetch
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        throw new Error('User ID not found in storage');
      }

      setUserId(storedUserId);
      const response = await fetch(`https://nityasha.vercel.app/api/v1/consultants/${storedUserId}`);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setConsultants(data);
      } else if (typeof data === 'object' && data !== null) {
        setConsultants([data]);
      } else {
        throw new Error('Data format is not valid');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // Set refreshing to false when done
    }
  };
  useEffect(() => {
    const requestNotificationsPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus !== 'granted') {
                alert('You will not receive notifications!');
            }
        }
    };

    requestNotificationsPermission();
}, []);
  const startAnimation = () => {
    const animations = fadeAnim.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 300,
        useNativeDriver: true,
      });
    });

    Animated.stagger(300, animations).start();
  };

  useEffect(() => {
    fetchConsultants(); // Initial fetch
    startAnimation();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.replace('Login'); // Navigate to the login screen
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Function to handle the refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchConsultants(); // Fetch consultants again
  };

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <ActivityIndicator size="large" color="#fff" />
        <StatusBar barStyle="dark-content" backgroundColor="#000" translucent={true} />
        </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-red-500`}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={tw`flex h-full w-full bg-[#000] px-5 py-2`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
      }
    >
      <Text style={[tw`text-[#fff] text-4xl pb-3`, { fontFamily: 'Urbanist_800ExtraBold' }]}>Dashboard</Text>
      <StatusBar barStyle="dark-content" backgroundColor="#000" translucent={true} />

      <View style={tw`flex items-center justify-between w-full flex-row`}>
        <Userinfod />
        <View style={tw`flex items-center justify-center flex-row gap-3`}>
          <TouchableOpacity onPress={() => navigation.navigate('Analysis')} style={tw`flex p-4 bg-[#1e1e1e] rounded-full`}>
            <ChartPie color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={tw`flex p-4 bg-[#1e1e1e] rounded-full`}>
            <Bell color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <ScrollView horizontal style={tw`mt-5 w-full`} showsHorizontalScrollIndicator={false}>
          {['Balance', 'Live', 'Stocks', 'Vote', 'Balance',].map((item, index) => (
            <Animated.View
              key={index}
              style={[tw`flex items-center justify-center mr-2 bg-[#1e1e1e] px-8 h-13 rounded-full`, { opacity: fadeAnim[index] }]}
            >
              <Text style={[tw`text-white`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                {item}
              </Text>
            </Animated.View>
          ))}
          <TouchableOpacity
           onPress={() => navigation.navigate('Pvt')}
              style={[tw`flex items-center justify-center mr-2 bg-[#1e1e1e] px-8 h-13 rounded-full`]}
            >
              <Text style={[tw`text-white`, { fontFamily: 'Urbanist_600SemiBold' }]}>
              Balance
              </Text>
            </TouchableOpacity>
        </ScrollView>
      </View>

      {consultants.map((consultant, index) => (
        <View key={index} style={tw`flex p-3 w-full bg-[#CFF008] h-48 mt-3 rounded-2xl`}>
          <Text style={[tw`text-[#131313] text-base`, { fontFamily: 'Urbanist_600SemiBold' }]}>Total Balance</Text>
          <Text style={[tw`text-[#131313] text-3xl mt-2`, { fontFamily: 'Urbanist_600SemiBold' }]}>
          ₹{((consultant.balance || 0) * 0.8).toFixed(2)} INR
          </Text>
          <View style={tw`flex flex-row items-center justify-center gap-2 mt-5`}>
            <View style={tw`flex flex-row items-center justify-between w-full`}>
              <View style={tw`flex p-6 mr-2 bg-[#00000048] rounded-full`}>
                <Orbit color="#fff" />
              </View>
              <View style={tw`flex p-6 mr-2 bg-[#00000048] rounded-full`}>
                <Gem color="#fff" />
              </View>
              <View style={tw`flex p-6 mr-2 bg-[#00000048] rounded-full`}>
                <Magnet color="#fff" />
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Payment")} style={tw`flex p-6 mr-2 bg-[#00000048] rounded-full`}>
                <IndianRupee color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {consultants.map((consultant, index) => (
        consultant.verified_email === 0 && (
          <View key={index} style={tw`flex items-center justify-center border border-zinc-800 py-3 mt-5 rounded-xl px-5`}>
            <View style={tw`flex flex-row items-center justify-between w-full pr-5 gap-5`}>
              <Image
                style={tw`flex w-15 h-20`}
                source={require('../../../assets/images/Frame 5.png')}
                resizeMode="contain"
              />
              <View style={tw`flex justify-center`}>
                <Text style={[tw`flex text-white text-base`, { fontFamily: 'Urbanist_600SemiBold' }]}>Confirm your email address</Text>
                <Text style={[tw`flex text-[#919191] text-base w-[80%]`, { fontFamily: 'Urbanist_600SemiBold' }]}>Verify your email to keep your account extra secure</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Vemail')} style={tw`bg-[#CFF008] w-full h-12 rounded-full flex items-center justify-center mt-3`}>
              <Text style={[tw`flex text-black text-base`, { fontFamily: 'Urbanist_800ExtraBold' }]}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        )
      ))}

      <Text style={[tw`flex text-white mt-3 text-xl`, { fontFamily: 'Urbanist_600SemiBold' }]}>Messages Pending</Text>
      <MessagesPendingH />

      <View style={tw`h-[5rem] w-full`}></View>
    </ScrollView>
  );
}
