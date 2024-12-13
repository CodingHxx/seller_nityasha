import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc'; // Tailwind CSS for styling
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';

export default function WidowableForm() {
  const [money, setMoney] = useState('');
  const [description, setDescription] = useState('');
  const [widowDate, setWidowDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!money || !widowDate) {
      setError('Please fill in all fields');
      return;
    }
  
    // Validate the date format (example: 'YYYY-MM-DD')
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(widowDate)) {
      setError('Widow date must be in the format YYYY-MM-DD');
      return;
    }
  
    setIsLoading(true);
    setError('');
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        setError('User ID not found');
        setIsLoading(false);
        return;
      }
  
      const data = {
        money: parseInt(money),
        widow_status: 'active',
        widow_date: widowDate
      };
  
      console.log('Data being sent to API:', data); // Log the data being sent to the API for debugging
      console.log(`https://nityasha.vercel.app/api/partner/widowable/${storedUserId}`)
      const response = await fetch(`https://nityasha.vercel.app/api/partner/widowable/${storedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      console.log('API Response:', result); // Log the full API response for detailed error checking
  
      if (response.ok) {
        setSuccessMessage('Form submitted successfully!');
        navigation.goBack();
        setMoney(''); // Clear input after success
        setDescription('');
        setWidowDate('');
      } else {
        setError('Error submitting form: ' + (result.error || 'An unknown error occurred'));
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Formats date as 'YYYY-MM-DD'
    setWidowDate(formattedDate);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center bg-black p-4`}>
      <Text style={[tw`text-white text-2xl mb-4`, { fontFamily: 'Urbanist_700Bold' }]}>Withdrawal Form</Text>
      <View style={tw`w-full max-w-md`}>
        <TextInput
          placeholder="Money"
          value={money}
          onChangeText={setMoney}
          style={tw`mb-4 p-3 border border-white rounded text-white placeholder-gray-400`}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          style={tw`mb-4 p-2 border border-gray-300 rounded text-white placeholder-gray-400`}
          placeholder="Enter widow date"
          value={widowDate}
          placeholderTextColor="#9CA3AF"
          onFocus={showDatePicker}  // Show the date picker on focus
        />

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        
        {error && <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>}
        {successMessage && <Text style={tw`text-green-500 text-center mb-4`}>{successMessage}</Text>}
        
        <TouchableOpacity onPress={handleSubmit} style={tw`bg-white rounded p-3`}>
          <Text style={[tw`text-black text-center`, { fontFamily: 'Urbanist_700Bold' }]}>Submit</Text>
        </TouchableOpacity>
        
        {isLoading && <ActivityIndicator size="large" color="#fff" style={tw`mt-4`} />}
      </View>
    </SafeAreaView>
  );
}
