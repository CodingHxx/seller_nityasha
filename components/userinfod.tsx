import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you have AsyncStorage installed
import tw from 'twrnc'; // Ensure you're using Tailwind CSS with React Native

const NotificationCard = () => {
    const [consultants, setConsultants] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // State to hold userId

    // Fetch userId from AsyncStorage and call API
    const fetchConsultants = async () => {
        try {
            // Get userId from AsyncStorage
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
                throw new Error('User ID not found in storage');
            }
            setUserId(storedUserId); // Set userId in state

            // Fetch consultants from the API using the userId
            const response = await fetch(`https://nityasha.vercel.app/api/v1/consultants/${storedUserId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Check if data is an array or a single object
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
        }
    };

    useEffect(() => {
        fetchConsultants(); // Initial fetch
    }, []); // Empty dependency array to run only once on mount

    // Render loading state
    if (loading) {
        return (
            <SafeAreaView style={tw`flex items-center justify-center flex-row h-full`}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[tw`text-white`, { fontFamily: 'Urbanist_600SemiBold' }]}>Loading...</Text>
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
        <SafeAreaView>
            {consultants.map((consultant, index) => (
                <View key={index} style={tw`flex items-center justify-center gap-2 flex-row mb-4`}>
                    <View style={tw`flex items-center justify-center bg-white w-12 h-12 rounded-full overflow-hidden`}>
                        <Image
                            style={tw`w-full h-full`}
                            source={{ uri: consultant.pfp || 'default-image-url.jpg' }} // Use the profile picture field
                        />
                    </View>
                    <View style={tw`ml-3`}>
                        {/* Provide fallback for null or undefined values */}
                        <Text style={[tw`text-white`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                            {consultant.name || 'No name provided'}
                        </Text>
                        <Text style={[tw`text-[#8f8f8f]`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                            @{consultant.email || 'No email available'}
                        </Text>
                    </View>
                </View>
            ))}
        </SafeAreaView>
    );
};

export default NotificationCard;
