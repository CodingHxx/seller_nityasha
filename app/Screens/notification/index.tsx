import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { ChevronLeft } from 'lucide-react-native';
import Bell from '@/components/icons/Bell';
import Svg, { Path } from 'react-native-svg';
import NotificationCard from '@/components/NotificationCard';

export default function Notification({ navigation }) {
  return (
    <ScrollView style={tw`h-full bg-black px-5 pt-5`}>
      <Text style={[tw`text-[#fff] text-4xl pb-3`, { fontFamily: 'Urbanist_700Bold' }]}>Notification</Text>
      <View style={tw`flex items-center justify-center gap-5 py-5`}>
        <NotificationCard />
      </View>
    </ScrollView>
  )
}