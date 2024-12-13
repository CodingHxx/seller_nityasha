import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { ChevronLeft } from 'lucide-react-native';
import {
  useFonts,
  Urbanist_700Bold,
  Urbanist_500Medium,
  Urbanist_400Regular,
} from '@expo-google-fonts/urbanist';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Load the fonts
  const [fontsLoaded] = useFonts({
    Urbanist_700Bold,
    Urbanist_500Medium,
    Urbanist_400Regular,
  });

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('https://nityasha.vercel.app/api/v1/consultants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  // Check if fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black h-full w-full`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 px-5 bg-black`}>
      <View style={tw`flex mt-10 items-center justify-center gap-5`}>
        <Text style={[tw`w-full flex items-center justify-center text-white`, {fontFamily: 'Satoshi-Variable'}]}>
          Enter your phone number and set your password
        </Text>
        <TextInput
          placeholder='Phone Number'
          keyboardType='numeric'
          value={email}
          onChangeText={setEmail}
          style={tw`w-full px-5 py-2 border-2 rounded-[12px] border-[#D7D9DC] text-white`}
        />

        {/* Password Input */}
        <TextInput
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={tw`w-full px-5 py-2 border-2 rounded-[12px] border-[#D7D9DC] text-white`}
        />

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleSignUp} style={tw`px-5 text-[14px] py-3 flex items-center justify-center text-center rounded-[8px] bg-white text-black w-full`}>
          <Text style={tw`text-black`}>Sign Up</Text>
        </TouchableOpacity>     
      </View>
    </SafeAreaView>
  );
}
