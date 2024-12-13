import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pfp from '@/components/pfp';

export default function Account_Information({ navigation }) {

  const [userInfo, setUserInfo] = useState({
    name: '',
    number: '',
    pfp: '',
    email: '',
    country: '',
    GENDER: '0', // Default to male (0)
    birth_date: '',
    per_minute_rate: '', // Add per_minute_rate to state
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); // Update to use 'userId'
        const response = await fetch(`https://nityasha.vercel.app/api/v1/consultantss/${userId}`);
        const data = await response.json();
        setUserInfo({
          name: data.name.trim(),
          email: data.email,
          pfp: data.pfp,
          country: 'india', // Default or fetched country
          GENDER: data.GENDER || '0', // Assuming the API returns '0', '1', or '2'
          birth_date: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '',
          per_minute_rate: data.per_minute_rate || '', // Assuming the API returns per_minute_rate
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!/^\d{10}$/.test(userInfo.number)) {
      Alert.alert("Error", "Phone number must be exactly 10 digits and contain only numbers.");
      return;
    }

    // Validate per_minute_rate to be a valid number
    if (!/^\d+(\.\d{1,2})?$/.test(userInfo.per_minute_rate)) {
      Alert.alert("Error", "Per minute rate must be a valid number.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId'); // Update to use 'userId'

      const response = await fetch(`https://nityasha.vercel.app/api/v1/consultantss/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          number: userInfo.number,
          pfp: userInfo.pfp,
          email: userInfo.email,
          GENDER: userInfo.GENDER,
          birth_date: userInfo.birth_date,
          per_minute_rate: userInfo.per_minute_rate, // Include per_minute_rate in the request
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Your information has been saved successfully.");
        navigation.navigate('Profile', { reload: true }); // Pass reload parameter
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to save user information.");
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <ScrollView style={tw`px-5 bg-black h-full`}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw`flex items-start justify-start flex-row gap-1`}>
        <ChevronLeft size={30} color={"#FFFFFF"} />
        <Text style={[tw`text-[#FFFFFF] font-medium text-base h-full flex items-center justify-center mt-1`, { fontFamily: 'Helvetica_bold' }]}>
          Account Information
        </Text>
      </TouchableOpacity>
      <View style={tw`flex items-center justify-center mt-5`}>
      <Pfp pfp={userInfo.pfp} />
      </View>
      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>User Name</Text>
      <TextInput
        placeholder='Enter your name'
        placeholderTextColor="#CCCCCC"
        value={userInfo.name}
        onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        style={tw`w-full px-5 mt-2 py-2 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white`}
      />

      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>Phone Number</Text>
      <TextInput
        placeholder='+91 1234567890'
        placeholderTextColor="#CCCCCC"
        keyboardType='numeric'
        value={userInfo.number}
        onChangeText={(text) => setUserInfo({ ...userInfo, number: text })}
        style={tw`w-full px-5 mt-2 py-2 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white`}
      />

      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>Email</Text>
      <TextInput
        placeholder='Enter your email'
        placeholderTextColor="#CCCCCC"
        keyboardType='email-address'
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
        style={tw`w-full px-5 mt-2 py-2 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white`}
      />

      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>Country</Text>
      <TextInput
        placeholder='India'
        placeholderTextColor="#CCCCCC"
        value={userInfo.country}
        onChangeText={(text) => setUserInfo({ ...userInfo, country: text })}
        style={tw`w-full px-5 mt-2 py-2 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white`}
      />

      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>Gender</Text>
      <Picker
        selectedValue={userInfo.GENDER}
        style={tw`w-full h-12 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white overflow-hidden`}
        itemStyle={{ color: '#FFFFFF' }}
        onValueChange={(itemValue) => setUserInfo({ ...userInfo, GENDER: itemValue })}>
        <Picker.Item label="Male" value="0" />
        <Picker.Item label="Female" value="1" />
        <Picker.Item label="Other" value="2" />
      </Picker>

      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>Birth Date</Text>
      <TextInput
        placeholder='YYYY-MM-DD'
        placeholderTextColor="#CCCCCC"
        value={userInfo.birth_date}
        onChangeText={(text) => setUserInfo({ ...userInfo, birth_date: text })}
        style={tw`w-full px-5 mt-2 py-2 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white`}
      />

      <Text style={[tw`mt-5 text-[#FFFFFF]`, { fontFamily: 'Helvetica_bold' }]}>Per Minute Rate</Text>
      <TextInput
        placeholder='Enter rate per minute'
        placeholderTextColor="#CCCCCC"
        keyboardType='numeric'
        value={userInfo.per_minute_rate}
        onChangeText={(text) => setUserInfo({ ...userInfo, per_minute_rate: text })}
        style={tw`w-full px-5 mt-2 py-2 border-2 rounded-[12px] border-[#CCCCCC] bg-gray-800 text-white`}
      />

      <View style={tw`w-full flex gap-2 flex-row mt-4 items-center justify-center`}>
        <TouchableOpacity onPress={handleSave} style={tw`px-5 text-[14px] py-3 flex items-center justify-center text-center rounded-[8px] bg-white shadow-none w-[50%] border-[#CCCCCC] border-2`}>
          <Text style={{ color: '#000000' }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={tw`px-5 text-[14px] py-3 flex items-center justify-center text-center rounded-[8px] bg-white shadow-none w-[50%] border-[#CCCCCC] border-2`}>
          <Text style={{ color: '#000000' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
