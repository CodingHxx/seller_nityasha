import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you have AsyncStorage installed
import tw from 'twrnc'; // Ensure you're using Tailwind CSS with React Native
import { UserRound, Phone, Mail, MessageCircleMore, Settings } from 'lucide-react-native';

const Profile = ({ navigation }: { navigation: any }) => {
  const [consultants, setConsultants] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold userId
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  // Fetch userId from AsyncStorage and call API
  const fetchConsultants = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        throw new Error('User ID not found in storage');
      }
      setUserId(storedUserId); // Set userId in state

      const response = await fetch(`https://nityasha.vercel.app/api/v1/consultants/${storedUserId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setConsultants(data); // Set the data into state
      } else if (typeof data === 'object' && data !== null) {
        setConsultants([data]); // Wrap single object in an array
      } else {
        throw new Error('Data format is not valid');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false when done
      setRefreshing(false); // Stop refreshing when done
    }
  };

  useEffect(() => {
    fetchConsultants(); // Initial fetch
  }, []); // Empty dependency array to run only once on mount

  // Pull to refresh function
  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchConsultants(); // Fetch consultants again
  };

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={tw`flex items-center justify-center flex-row h-full bg-black`}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={tw`flex items-center justify-center h-full`}>
        <Text style={tw`text-red-500`}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // Ensure consultants is an array before rendering
  if (!Array.isArray(consultants) || consultants.length === 0) {
    return (
      <SafeAreaView style={tw`flex items-center justify-center h-full`}>
        <Text style={tw`text-red-500`}>Error: No consultants available.</Text>
      </SafeAreaView>
    );
  }

  // Render consultants list
  return (
    <SafeAreaView style={tw`bg-black h-full w-full`}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {consultants.map((consultant, index) => (
          <SafeAreaView key={index} style={tw`flex px-3 h-full w-full bg-black`}>
            <View style={tw`flex items-center justify-between w-full flex-row`}>
              <Text style={[tw`text-[#fff] text-4xl pb-3`, { fontFamily: 'Urbanist_700Bold' }]}>Profile</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={tw`flex items-center w-10 h-10`}
              >
                <Settings size={28} color={'#fff'} />
              </TouchableOpacity>
            </View>
            <View style={tw`flex w-full h-20 flex-row items-center justify-between mb-5`}>
              <View style={tw`flex items-center justify-center flex-row`}>
                <View style={tw`flex bg-white w-15 h-15 items-center justify-center rounded-full overflow-hidden`}>
                  <Image
                    style={tw`w-full h-full`}
                    source={{ uri: consultant.pfp || 'default-image-url.jpg' }} // Use the profile picture field
                  />
                </View>
                <View style={tw`flex ml-2`}>
                  <Text style={tw`flex text-zinc-500`}>Welcome Back !!</Text>
                  <Text style={[tw`flex text-white`, { fontFamily: 'Urbanist_500Medium' }]}> {consultant.name || 'No name provided'}</Text>
                </View>
              </View>
            </View>
            <Text style={[tw`flex text-white pl-3`, { fontFamily: 'Urbanist_500Medium' }]}>Personal Details</Text>
            <View style={tw`items-start justify-start w-full bg-[#131313] rounded-[20px] mt-3`}>
              <View style={tw`flex items-start justify-start w-full p-3`}>
                <View style={tw`flex items-center justify-center flex-row`}>
                  <View style={tw`flex bg-white w-15 h-15 items-center justify-center rounded-full`}>
                    <UserRound size={28} color={'#000'} />
                  </View>
                  <View style={tw`flex ml-2`}>
                    <Text style={tw`flex text-zinc-500`}>Name</Text>
                    <Text style={[tw`flex text-white`, { fontFamily: 'Urbanist_500Medium' }]}>{consultant.name || 'No name provided'}</Text>
                  </View>
                </View>
                <View style={tw`flex items-center justify-center flex-row mt-5`}>
                  <View style={tw`flex bg-white w-15 h-15 items-center justify-center rounded-full`}>
                    <Phone size={28} color={'#000'} />
                  </View>
                  <View style={tw`flex ml-2`}>
                    <Text style={tw`flex text-zinc-500`}>Phone Number</Text>
                    <Text style={[tw`flex text-white`, { fontFamily: 'Urbanist_500Medium' }]}>+91 {consultant.number || 'No number available'}</Text>
                  </View>
                </View>
              </View>
              <View style={tw`flex items-start justify-start w-full p-3`}>
                <View style={tw`flex items-center justify-center flex-row`}>
                  <View style={tw`flex bg-white w-15 h-15 items-center justify-center rounded-full`}>
                    <Mail size={28} color={'#000'} />
                  </View>
                  <View style={tw`flex ml-2`}>
                    <Text style={tw`flex text-zinc-500`}>Email address</Text>
                    <Text style={[tw`flex text-white`, { fontFamily: 'Urbanist_500Medium' }]}>{consultant.email || 'No email available'}</Text>
                  </View>
                </View>
              </View>
              <View style={tw`flex items-start justify-start w-full p-3`}>
                <View style={tw`flex items-center justify-center flex-row`}>
                  <View style={tw`flex bg-white w-15 h-15 items-center justify-center rounded-full`}>
                    <MessageCircleMore size={28} color={'#000'} />
                  </View>
                  <View style={tw`flex ml-2`}>
                    <Text style={tw`flex text-zinc-500`}>Per Minute Rate</Text>
                    <Text style={[tw`flex text-white`, { fontFamily: 'Urbanist_500Medium' }]}>{consultant.per_minute_rate || 'No rate available'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
