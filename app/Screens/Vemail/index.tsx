import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import {
  useFonts,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
} from '@expo-google-fonts/urbanist';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Vemail() {
  const [otp, setOtp] = useState('');        // Input field OTP value
  const [generatedOtp, setGeneratedOtp] = useState('');  // Generated OTP
  const [otpSent, setOtpSent] = useState(false);  // To track if OTP was sent

  let [fontsLoaded] = useFonts({
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Show a loading state while fonts are being loaded
  }

  // Function to generate a random 6-digit OTP
  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
    setGeneratedOtp(newOtp);
    console.log("Generated OTP:", newOtp); // Simulates sending the OTP (e.g., log it)
    setOtpSent(true); // Update state to indicate OTP was sent
    Alert.alert('OTP Sent', `Your OTP is: ${newOtp}`, [{ text: 'OK' }]); // Alert user (for demo purposes)
  };

  // Function to handle OTP verification
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      console.log("OTP verified successfully!");
      Alert.alert('Success', 'OTP Verified Successfully', [{ text: 'OK' }]);
    } else {
      console.log("Incorrect OTP. Please try again.");
      Alert.alert('Error', 'Incorrect OTP. Please try again.', [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={tw`flex bg-black px-3 w-full h-full items-center justify-center py-5`}>
      <Text style={[tw`text-white text-4xl pb-10`, { fontFamily: 'Urbanist_700Bold' }]}>
        Verifying Email
      </Text>
      
      {/* OTP Input */}
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder='Enter OTP'
        placeholderTextColor={'#7e7d7d'}
        style={tw`flex w-full border border-zinc-800 h-14 rounded-xl text-white pl-5 text-base`}
        keyboardType='number-pad'
      />

      {/* Send OTP Button (Visible only if OTP hasn't been sent) */}
      {!otpSent && (
        <TouchableOpacity
          style={tw`flex w-full h-14 items-center justify-center bg-[#007bff] rounded-full mt-5`}
          onPress={generateOtp}  // Generates OTP
        >
          <Text style={[tw`text-white text-base`, { fontFamily: 'Urbanist_700Bold' }]}>
            Send OTP
          </Text>
        </TouchableOpacity>
      )}

      {/* Verify OTP Button */}
      <TouchableOpacity
        style={tw`flex w-full h-14 items-center justify-center bg-[#CFF008] rounded-full mt-5`}
        onPress={verifyOtp}  // Verifies entered OTP
      >
        <Text style={[tw`flex text-black text-base`, { fontFamily: 'Urbanist_800ExtraBold' }]}>
          Verify Email
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
