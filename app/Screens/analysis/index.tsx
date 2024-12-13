import { View, Text, SafeAreaView, Image, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from '@expo-google-fonts/urbanist';
import { PiggyBank, MessageCircleMore, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Widowable from '@/components/Widowable';

const REFRESH_INTERVAL = 50000; // Interval set to 5 seconds

export default function Analysis() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  const fetchConsultants = async () => {
    try {
      setRefreshing(true); // Start refreshing
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) throw new Error('User ID not found in storage');

      setUserId(storedUserId);
      const response = await fetch(`https://nityasha.vercel.app/api/v1/consultants/${storedUserId}`);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${errorMessage}`);
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
      setRefreshing(false); // Stop refreshing
    }
  };

  useEffect(() => {
    fetchConsultants(); // Initial fetch
    const intervalId = setInterval(fetchConsultants, REFRESH_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  let [fontsLoaded] = useFonts({ /* Your fonts here */ });

  if (loading || !fontsLoaded) {
    return (
      <View style={tw`flex items-center justify-center h-full bg-black`}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex items-center justify-center h-full`}>
        <Text style={tw`text-red-500`}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex bg-black h-full w-full px-3 py-2`}>
      <Text style={[tw`text-[#fff] text-4xl pb-3`, { fontFamily: 'Urbanist_700Bold' }]}>Analysis</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchConsultants} />
        }
      >
        <View style={tw`flex flex-row justify-between items-center w-full h-32`}>
          {consultants.map((consultant, index) => (
            <View key={index} style={tw`flex p-3 bg-black w-[48%] rounded-xl h-full border border-zinc-800`}>
              <View style={tw`flex items-center justify-between w-full flex-row`}>
                <View style={tw`flex items-center justify-center h-10 w-10 border border-zinc-800 rounded-full`}>
                  <PiggyBank size={25} color="#fff" />
                </View>
                <Text style={[tw`text-emerald-500 text-[15px] mt-2`, { fontFamily: 'Urbanist_700Bold' }]}>+₹14</Text>
              </View>
              <Text style={[tw`text-white text-[20px] mt-1`, { fontFamily: 'Urbanist_700Bold' }]}>Income</Text>
              <Text style={[tw`text-white text-[15px] mt-2`, { fontFamily: 'Urbanist_700Bold' }]}>₹{((consultant.balance || 0) * 0.8).toFixed(2)}</Text>
            </View>
          ))}
          {consultants.map((consultant, index) => (
            <View key={index} style={tw`flex p-3 bg-black w-[48%] rounded-xl h-full border border-zinc-800`}>
              <View style={tw`flex items-center justify-between w-full flex-row`}>
                <View style={tw`flex items-center justify-center h-10 w-10 border border-zinc-800 rounded-full`}>
                  <MessageCircleMore size={25} color="#fff" />
                </View>
                <Text style={[tw`text-emerald-500 text-[15px] mt-2`, { fontFamily: 'Urbanist_700Bold' }]}>+20</Text>
              </View>
              <Text style={[tw`text-white text-[20px] mt-1`, { fontFamily: 'Urbanist_700Bold' }]}>Chat's</Text>
              <Text style={[tw`text-white text-[15px] mt-2`, { fontFamily: 'Urbanist_700Bold' }]}>{consultant.total_sales}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Widowables')}
          style={tw`flex items-center justify-center py-3 px-2 w-full rounded-xl bg-white mt-5`}
        >
          <Text style={[tw`text-base text-black`, { fontFamily: 'Urbanist_700Bold' }]}>
            Make Withdrawal
          </Text>
        </TouchableOpacity>
        <Widowable />
      </ScrollView>
    </SafeAreaView>
  );
}
