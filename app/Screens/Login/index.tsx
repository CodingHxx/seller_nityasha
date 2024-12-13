import { View, Text, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import {
  useFonts,
  Urbanist_700Bold,
  Urbanist_500Medium,
  Urbanist_400Regular,
} from '@expo-google-fonts/urbanist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Use the navigation hook
  
  let [fontsLoaded] = useFonts({
    Urbanist_700Bold,
    Urbanist_500Medium,
    Urbanist_400Regular,
  });

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please enter your email/phone and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://nityasha.vercel.app/api/v1/consultants/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Save user information (e.g., token, userId) to AsyncStorage
        await AsyncStorage.setItem('userId', data.userId.toString());
          // Navigate to Home screen after successful login
        navigation.navigate('BottomTabs'); // Adjust this to navigate to the home screen within your bottom tab navigator
      } else {
        Alert.alert('Error', data.message || 'Login failed');
        // Navigate to Welcome screen on login failure
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
      // You can also navigate to the Welcome screen in case of an error
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={tw`flex items-center justify-center h-full w-full bg-[#000]`}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex px-5 h-full w-full bg-black`}>
      <Text style={[tw`text-[#fff] text-4xl`, { fontFamily: 'Urbanist_700Bold' }]}>Let's Sign you in.</Text>
      <Text style={[tw`text-[#fff] text-4xl mt-3`, { fontFamily: 'Urbanist_500Medium' }]}>Welcome back.</Text>
      <Text style={[tw`text-[#fff] text-4xl`, { fontFamily: 'Urbanist_500Medium' }]}>You've been missed!</Text>
      <TextInput 
        placeholder="Email or Phone" 
        style={[tw`text-[#fff] mt-[10%] text-lg placeholder:text-white border-2 border-white px-2 py-3 rounded-xl pl-4`, { fontFamily: 'Urbanist_400Regular' }]} 
        value={emailOrPhone} 
        onChangeText={setEmailOrPhone} 
        placeholderTextColor="#ccc"
        accessibilityLabel="Email or Phone Input"
      />
      <TextInput 
        placeholder="Password" 
        style={[tw`mt-3 text-white placeholder:text-white text-lg border-2 border-white px-2 py-3 rounded-xl pl-4`, { fontFamily: 'Urbanist_400Regular' }]} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        accessibilityLabel="Password Input"
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity 
        style={[tw`mt-5 flex bg-white rounded-lg px-5 w-full py-3 items-center justify-center`, { fontFamily: 'Urbanist_500Medium' }]}
        onPress={handleLogin}
        disabled={loading} 
        accessibilityLabel="Login Button"
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={[tw`text-black text-lg text-center`, { fontFamily: 'Urbanist_500Medium' }]}>Login</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
