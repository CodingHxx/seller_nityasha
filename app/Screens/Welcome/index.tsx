import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { Video } from 'expo-av';
import tw from 'twrnc';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  useFonts,
  Urbanist_100Thin,
  Urbanist_200ExtraLight,
  Urbanist_300Light,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  Urbanist_900Black,
} from '@expo-google-fonts/urbanist';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { CommonActions } from '@react-navigation/native';

export default function Welcome() {
  let [fontsLoaded] = useFonts({
    Urbanist_100Thin,
    Urbanist_200ExtraLight,
    Urbanist_300Light,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    Urbanist_900Black,
  });
  
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        // If userId exists, navigate to Home (or BottomTabs)
        navigation.dispatch(
          CommonActions.reset({
            index: 0, // Set the active route index
            routes: [{ name: 'BottomTabs' }], // The route to navigate to
          })
        );
      }
    };

    checkLoginStatus();
  }, [navigation]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={tw`flex items-center justify-center h-full w-full bg-[#000]`}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex items-center justify-between px-5 h-full w-full bg-[#000]`}>
      <StatusBar barStyle="dark-content" backgroundColor="#000" translucent={true} />
      <Video
        source={require('@/assets/videos/welcome.mp4')}
        style={tw`w-full h-[30rem]`} 
        resizeMode="contain"
        isLooping
        shouldPlay
      />
      <View style={tw`flex items-center justify-center mb-10`}>
        <Text style={[tw`text-white text-xl py-2`, { fontFamily: 'Urbanist_700Bold' }]}>
          Your one-stop area for all things
        </Text>
        <Text style={[tw`text-[#8f8f8f] py-2 text-center`, { fontFamily: 'Urbanist_500Medium' }]}>
          High-quality K-pop idols, concerts, and other K-pop related content
        </Text>
        <View style={tw`flex items-center justify-center flex-row gap-5 mt-5 mb-5`}>
          <TouchableOpacity 
            style={tw`flex bg-white rounded-lg px-5 w-full py-3 items-center justify-center`}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[tw`text-black`, { fontFamily: 'Urbanist_700Bold' }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
