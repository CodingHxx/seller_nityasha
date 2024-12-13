import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc'; // Ensure you're using Tailwind CSS with React Native
import { Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoChats from './Icon/noChats';

const MessagesPendingH = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [approvedConsultants, setApprovedConsultants] = useState(new Set());
    const maxConsultantsToShow = 5;

    const navigation = useNavigation();

    const fetchConsultants = async () => {
        setLoading(true);
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
                throw new Error('User ID not found in storage');
            }
            setUserId(storedUserId);

            const response = await fetch(`https://nityasha.vercel.app/api/partner/inbox/${storedUserId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setConsultants(data);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultants();
        const intervalId = setInterval(fetchConsultants, 10000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const checkChatExpiration = () => {
            consultants.forEach((consultant) => {
                const currentTime = Date.now();
                const expirationTime = new Date(consultant.requestDetails?.time).getTime();
                if (currentTime > expirationTime && approvedConsultants.has(consultant.userId)) {
                    updateIsChatOn(consultant.userId, 0);
                }
            });
        };
        const expirationCheckInterval = setInterval(checkChatExpiration, 60000);
        return () => clearInterval(expirationCheckInterval);
    }, [consultants, approvedConsultants]);

    if (loading) {
        return (
            <View style={tw`flex justify-center items-center w-full h-full`}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={tw`text-white mt-4`}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    const consultantsToShow = consultants.slice(0, maxConsultantsToShow);

    return (
        <>
            {consultantsToShow.length > 0 ? (
                consultantsToShow.map((consultant, index) => (
                    <View key={index} style={tw`flex items-center justify-between w-full flex-row mt-4 py-1`}>
                        <View style={tw`flex items-center justify-center gap-2 flex-row`}>
                            <View style={tw`flex items-center justify-center bg-white w-12 h-12 rounded-full overflow-hidden`}>
                                <Image style={tw`flex w-full h-full`} source={{ uri: consultant.userDetails.pfp }} />
                            </View>
                            <View style={tw`flex justify-center items-center`}>
                                <Text style={[tw`text-white`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                                    {consultant.userDetails?.name || 'Unknown'}
                                </Text>
                            </View>
                        </View>
                        <View style={tw`flex items-center justify-center flex-row gap-3`}>
                        <Text style={[tw`text-white text-lg`, { fontFamily: 'Urbanist_600SemiBold' }]}>
    {(() => {
        const amount = consultant.requestDetails?.bel;

        // Check if the amount is a valid number
        if (isNaN(amount) || amount === null || amount === undefined) {
            return 'Free';
        }

        // If amount is a valid number, format it
        return `₹${parseFloat(amount).toFixed(2)}`;
    })()}
</Text>

                        </View>
                    </View>
                ))
            ) : (
                <View style={tw`flex items-center justify-center w-full mt-5`}>
                    <NoChats />
                    <Text style={[tw`text-white text-lg mt-4`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                        No Chat's
                    </Text>
                    <Text style={[tw`text-white text-xs mt-2`, { fontFamily: 'Urbanist_600SemiBold' }]}>You Don't Have Any Chats.</Text>
                </View>
            )}
        </>
    );
};

export default MessagesPendingH;
