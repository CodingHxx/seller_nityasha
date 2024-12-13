import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc'; // Ensure you're using Tailwind CSS with React Native
import { Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessagesPendingH = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [approvedConsultants, setApprovedConsultants] = useState(new Set());
    const maxConsultantsToShow = 5; // Limit the number of consultants displayed

    const navigation = useNavigation();

    const fetchConsultants = async () => {
        setLoading(true);
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
                throw new Error('User ID not found in storage');
            }

            setUserId(storedUserId);
            const response = await fetch(`https://nityasha.vercel.app/api/v1/${storedUserId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            // Ensure data is an array before setting state
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
        fetchConsultants(); // Initial fetch

        // Set interval for auto-reloading every 10 seconds
        const intervalId = setInterval(fetchConsultants, 10000); // 10000 milliseconds = 10 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        const checkChatExpiration = () => {
            consultants.forEach((consultant) => {
                const currentTime = Date.now();
                const expirationTime = new Date(consultant.requestDetails?.time).getTime();

                // Check if the chat time has expired
                if (currentTime > expirationTime && approvedConsultants.has(consultant.userId)) {
                    updateIsChatOn(consultant.userId, 0); // Set isChatOn to 0
                }
            });
        };

        // Check for expiration every minute
        const expirationCheckInterval = setInterval(checkChatExpiration, 60000);

        return () => clearInterval(expirationCheckInterval); // Cleanup on unmount
    }, [consultants, approvedConsultants]);

    const updateIsChatOn = async (consultantId, status) => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) {
                throw new Error('User ID not found in storage');
            }

            const response = await fetch(`https://nityasha.vercel.app/api/v1/consultantss/${storedUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isChatOn: status }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(`Failed to update isChatOn: ${data.error || response.statusText}`);
            }

            console.log(`isChatOn updated to ${status} successfully for consultant ${consultantId}`);
        } catch (err) {
            console.error(`Error updating isChatOn for consultant ${consultantId}:`, err);
            setError(err.message);
        }
    };

    const approveConsultant = async () => {
        setIsApproving(true); // Set loading state
        try {
            const storedUserIds = await AsyncStorage.getItem('userId');
            if (!storedUserIds) {
                throw new Error('User ID not found in storage');
            }

            const response = await fetch(`https://nityasha.vercel.app/api/v1/${storedUserIds}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch consultants: ${response.statusText}`);
            }

            const consultants = await response.json();
            console.log("Consultants:", consultants); // Log the response for debugging

            const consultant = consultants.find(item => item.consultantDetails.id === parseInt(storedUserIds, 10));
            console.log("Stored User ID:", storedUserIds);

            if (!consultant) {
                console.log("Consultant not found for user ID:", storedUserIds);
                throw new Error('Consultant not found');
            }

            if (!consultant.requestDetails || !consultant.requestDetails.chatRequestId) {
                console.log(consultant);
                throw new Error('chatRequestId is missing or consultant is not properly formatted');
            }

            const chatRequestId = consultant.requestDetails.chatRequestId;
            console.log(`Approving consultant with chatRequestId ${chatRequestId}`);

            const approvalResponse = await fetch(`https://nityasha.vercel.app/api/v1/${storedUserIds}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatRequestId: chatRequestId, status: 'approved' }),
            });

            if (!approvalResponse.ok) {
                const approvalData = await approvalResponse.json();
                console.log("Approval Response Data:", approvalData); // Log response data
                throw new Error(`Failed to approve consultant: ${approvalData.error || approvalResponse.statusText}`);
            }

            console.log("Consultant approved successfully");
            return true; // Return true on successful approval
        } catch (err) {
            console.error(err); // Log error for debugging
            setError(err.message); // Set error message to state
            return false; // Return false on error
        } finally {
            setIsApproving(false); // Reset loading state
        }
    };

    const handlePress = async (consultantId, time, roomN, bel) => {
        const numericTime = parseFloat(time) || 0; // Convert string to a float, fallback to 0
        console.log('Consultant ID:', consultantId);
        console.log('Numeric Time:', numericTime); // Log the numeric time
    
        const approvalSuccess = await approveConsultant(consultantId);
        const storedUserIds = await AsyncStorage.getItem('userId');
    
        if (approvalSuccess) {
            setApprovedConsultants(prev => new Set(prev).add(consultantId));
    
            // API call to add consultant bell and update user balance
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (!storedUserId) {
                    throw new Error('User ID not found in storage');
                }
    
                // Fetch the current balance first
                const balanceResponse = await fetch(`https://nityasha.vercel.app/api/v1/file/${storedUserId}`);
                if (!balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    throw new Error(`Failed to fetch current balance: ${balanceData.error || balanceResponse.statusText}`);
                }
    
                const currentBalanceData = await balanceResponse.json();
                const currentBalance = parseFloat(currentBalanceData.balance) || 0; 
                const numericBel = parseFloat(bel) || 0; // Ensure bel is a number
                const newBalance = currentBalance + numericBel; // Sum the balances
    
                // PUT request to update user balance and add consultant bell
                const response = await fetch(`https://nityasha.vercel.app/api/v1/file/${storedUserId}`, {
                    method: 'PUT', // Change to PUT method
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        balance: newBalance // Updated balance
                    }),
                });
    
                if (!response.ok) {
                    const bellData = await response.json();
                    console.error(`Failed to add bell or update balance: ${bellData.error || response.statusText}`);
                    throw new Error(bellData.error || 'Failed to add consultant bell or update balance');
                }
    
                console.log("Consultant bell added and balance updated successfully");
    
                // Set isChatOn to 1
                const chatOnResponse = await fetch(`https://nityasha.vercel.app/api/v1/consultantss/${storedUserId}`, {
                    method: 'PUT', // Use PUT to update
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ isChatOn: 1 }),
                });
    
                if (!chatOnResponse.ok) {
                    const chatOnData = await chatOnResponse.json();
                    throw new Error(`Failed to update isChatOn: ${chatOnData.error || chatOnResponse.statusText}`);
                }
    
                console.log("isChatOn updated to 1 successfully");
    
                // Navigate to ChatScreen after successful bell addition and balance update
                navigation.navigate('ChatScreen', { userId: consultantId, time: numericTime, roomN });
            } catch (err) {
                console.error("Error adding consultant bell or updating balance:", err);
                setError(err.message);
            }
        }
    };


    if (error) {
        return (
            <View style={tw`flex items-center justify-center h-full`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    return (
        <>
            {Array.isArray(consultants) && consultants.length > 0 ? (
                consultants.slice(0, maxConsultantsToShow).map((consultant, index) => ( // Limit the displayed consultants
                    <View key={index} style={tw`flex items-center justify-between w-full flex-row mt-4`}>
                        <View style={tw`flex items-center justify-center gap-2 flex-row`}>
                            <View style={tw`flex items-center justify-center bg-white w-12 h-12 rounded-full overflow-hidden`}>
                                <Image
                                    style={tw`flex w-full h-full`}
                                    source={{ uri: consultant.userDetails.pfp }}
                                />
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
                                disabled={isApproving}
                            >
                                {isApproving ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Check color="#fff" />
                                )}
                            </TouchableOpacity>
                            <Text style={[tw`text-white text-lg`, { fontFamily: 'Urbanist_600SemiBold' }]}>
                                ₹{consultant.requestDetails?.bel}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={tw`text-white`}>No consultants available</Text>
            )}
        </>
    );
};

export default MessagesPendingH;
