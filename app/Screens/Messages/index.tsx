import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useFonts, Urbanist_700Bold, Urbanist_500Medium, Urbanist_400Regular } from '@expo-google-fonts/urbanist';
import MessagesPending from '@/components/MessagesPending';

export default function Messages() {
  let [fontsLoaded] = useFonts({
    Urbanist_700Bold,
    Urbanist_500Medium,
    Urbanist_400Regular,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Add your data fetching logic here
    // For example: await fetchData();
    
    // Simulating a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Replace with your fetch logic
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={tw`flex items-center justify-center h-full w-full bg-[#000]`}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex px-3 h-full w-full bg-black`}>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MessagesPending />
      </ScrollView>
    </SafeAreaView>
  );
}

const Header = React.memo(() => {
  return (
    <Text style={[tw`text-[#fff] text-4xl pb-3`, { fontFamily: 'Urbanist_700Bold' }]}>
      Messages
    </Text>
  );
});
