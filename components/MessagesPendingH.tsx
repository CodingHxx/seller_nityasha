import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import tw from 'twrnc';

const MessagesPendingH = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchConsultants();

        // Background Fetch Initialization
        BackgroundFetch.configure(
            {
                minimumFetchInterval: 1, // Fetch every 15 minutes
                stopOnTerminate: false, // Keep running after app termination
                startOnBoot: true, // Start on device boot
            },
            async () => {
                console.log('[BackgroundFetch] task started');
                await fetchConsultants();
                BackgroundFetch.finish();
            },
            (error) => {
                console.log('[BackgroundFetch] failed to start: ', error);
            }
        );

        return () => {
            BackgroundFetch.stop(); // Clean up on unmount
        };
    }, []);

    // Fetch consultants
    const fetchConsultants = async () => {
        setLoading(true);
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
                throw new Error('User ID not found in storage');
            }
            const response = await fetch(`https://nityasha.vercel.app/api/v1/${storedUserId}`);
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

    // Notification function
    const sendNotification = (message) => {
        PushNotification.localNotification({
            title: 'New Request',
            message: message,
            playSound: true,
            soundName: 'default',
        });
    };

    // Approve consultant and trigger notifications
    const handlePress = async (consultantId, time, roomN, bel) => {
        // Approve logic here, followed by notification
        const numericTime = parseFloat(time) || 0;
        const approvalSuccess = await approveConsultant(consultantId);
        if (approvalSuccess) {
            sendNotification('Consultant has been approved');
            navigation.navigate('ChatScreen', { roomN, userId: consultantId, time });
        }
    };

    // Approve consultant (same logic as before)
    const approveConsultant = async (consultantId) => {
        try {
            const storedUserIds = await AsyncStorage.getItem('userId');
            if (!storedUserIds) {
                throw new Error('User ID not found in storage');
            }
            const response = await fetch(`https://nityasha.vercel.app/api/v1/${storedUserIds}`);
            if (!response.ok) {
                throw new Error('Failed to fetch consultants');
            }
            const consultants = await response.json();
            const consultant = consultants.find(item => item.consultantDetails.id === parseInt(storedUserIds, 10));
            if (!consultant || !consultant.requestDetails || !consultant.requestDetails.chatRequestId) {
                throw new Error('Invalid consultant data');
            }
            const chatRequestId = consultant.requestDetails.chatRequestId;
            const approvalResponse = await fetch(`https://nityasha.vercel.app/api/v1/${storedUserIds}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatRequestId, status: 'approved' }),
            });
            if (!approvalResponse.ok) {
                throw new Error('Failed to approve consultant');
            }
            console.log("Consultant approved successfully");
            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        }
    };

    if (error) {
        return (
            <View style={tw`flex-1 items-center justify-center`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 px-1`}>
            {Array.isArray(consultants) && consultants.length > 0 ? (
                consultants.map((consultant, index) => (
                    <View key={index} style={tw`flex items-center justify-between w-full flex-row mt-4`}>
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
                            <TouchableOpacity
                                style={tw`flex p-4 bg-[#1e1e1e] rounded-full`}
                                onPress={() => handlePress(consultant.userId, consultant.requestDetails?.time, consultant.requestDetails?.roomN, consultant.requestDetails?.bel)}
                            >
                                <Text style={tw`text-white`}>Accept</Text>
                            </TouchableOpacity>
                            <Text style={[tw`text-white text-lg`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                                {consultant.requestDetails?.time} min
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={tw`flex items-center justify-center`}>
                    <Text style={tw`text-white text-center`}>No pending requests yet!</Text>
                </View>
            )}
        </View>
    );
};

export default MessagesPendingH;
