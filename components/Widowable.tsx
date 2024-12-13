import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessagesPendingH = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConsultants = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const storedUserId = await AsyncStorage.getItem('userId'); // Corrected method name
            if (!storedUserId) {
                setError('User ID not found in storage');
                return;
            }

            const response = await fetch(`https://nityasha.vercel.app/api/partner/widowable/${storedUserId}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText || response.statusText}`);
            }

            const data = await response.json();
            
            // Handle empty array case explicitly
            if (Array.isArray(data)) {
                setConsultants(data);
                setError(null);
            } else if (data === null || data === undefined) {
                setConsultants([]);
                setError(null);
            } else {
                console.error('Invalid data format received:', data);
                throw new Error('Invalid data format received from server');
            }
        } catch (err) {
            setConsultants([]); // Reset consultants on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultants();
        const intervalId = setInterval(fetchConsultants, 10000);
        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return (
            <View style={tw`flex-1 items-center justify-center bg-gray-900`}>
                <Text style={tw`text-red-500 text-lg font-bold`}>Error</Text>
                <Text style={tw`text-white mt-2`}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={tw`flex-1 bg-black mt-5`}>
            <Text style={[tw`text-white text-2xl font-semibold mb-4`, { fontFamily: 'Urbanist_700Bold' }]}>
            Withdrawal History
            </Text>
            <View>
                {Array.isArray(consultants) && consultants.length > 0 ? (
                    consultants.map((consultant, index) => (
                        <View
                            key={index}
                            style={[
                                tw`flex-row justify-between items-center bg-black border border-zinc-800 rounded-lg p-4 mb-4`,
                                { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 },
                            ]}
                        >
                            <View>
                                <Text style={tw`text-white text-lg font-semibold`}>
                                    {consultant.money || 'N/A'} ₹
                                </Text>
                            </View>
                            <Text
                                style={[
                                    tw`px-4 py-2 rounded-full`,
                                    {
                                        backgroundColor: consultant.status === 'active' ? '#4CAF50' : '#111',
                                        color: '#fff',
                                        fontFamily: 'Urbanist_600SemiBold',
                                    },
                                ]}
                            >
                                {consultant.status.toUpperCase()}
                            </Text>
                        </View>
                    ))
                ) : (
                    <View style={tw`flex items-center justify-center mt-10`}>
                        <Text style={tw`text-gray-400 text-sm`}>
                            You haven't any Widowable available yet.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default MessagesPendingH;
