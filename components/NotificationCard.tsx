import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc'; // Ensure you're using Tailwind CSS with React Native
import { Info } from 'lucide-react-native';

const NotificationCard = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch consultants from API
    const fetchConsultants = async () => {
        try {
            const response = await fetch('https://nityasha.vercel.app/api/v1/notifications/get'); // Replace with your API URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setConsultants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultants(); // Initial fetch
        const intervalId = setInterval(fetchConsultants, 9000); // Set interval for 9 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    if (loading) {
        return (
            <View style={tw`flex items-center justify-center h-full`}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex items-center justify-center h-full`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    return (
        <>
            {consultants.map((consultant, index) => {
                return (
                    <TouchableOpacity key={index} style={tw`flex justify-center bg-black border border-zinc-800 px-5 py-5 rounded-lg w-full gap-2`}>
                        <View style={tw`flex items-center gap-1 flex-row`}>
                            <Info width={20} height={20} color={"#fff"} />
                            <Text style={[tw`font-bold text-sm flex-row justify-center items-center gap-3 capitalize text-white`, { fontFamily: 'Urbanist_700Bold' }]}>
                                {consultant.notification_type}
                            </Text>
                        </View>
                        <Text style={[tw`font-bold text-white`, { fontFamily: 'Urbanist_700Bold' }]}>
                        {consultant.notification_text}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </>
    );
};

export default NotificationCard;
